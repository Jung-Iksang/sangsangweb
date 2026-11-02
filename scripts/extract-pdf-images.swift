// PDF 안의 사진을 꺼내고(페이지 위치 포함) manifest.json 을 만든다 — macOS 전용 1회성 가져오기 도구
//
// 사용:
//   swift scripts/extract-pdf-images.swift "<운영계획.pdf>" /tmp/smaru-pdf/plan
//   swift scripts/extract-pdf-images.swift "<요약.pdf>" /tmp/smaru-pdf/summary
// 결과: <out>/pNN-iMM.jpg|png + <out>/manifest.json
//   manifest: [{ file, page, x, y, w, h (페이지 왼쪽 위 기준 pt), px, py (원본 픽셀) }]
//   + headers: [{ page, y }] — 운영계획의 "프로그램명" 표 머리 위치 (사진 → 프로그램 배정용)
// 그다음 scripts/import-photos.mjs 가 이 폴더를 읽어 public/photos/*.webp 로 변환한다.
import AppKit
import CoreGraphics
import Foundation
import PDFKit

let args = CommandLine.arguments
guard args.count >= 3 else {
  print("사용: swift scripts/extract-pdf-images.swift <pdf> <출력 폴더>")
  exit(1)
}
let pdfURL = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

struct Placed {
  let stream: CGPDFStreamRef
  let rect: CGRect // PDF 좌표 (왼쪽 아래 원점)
  let rotated: Bool
  let width: Int
  let height: Int
  let jpeg: Bool
}

final class Ctx {
  var ctm = CGAffineTransform.identity
  var stack: [CGAffineTransform] = []
  var found: [Placed] = []
  var table: CGPDFOperatorTableRef!
}

func ctx(_ info: UnsafeMutableRawPointer?) -> Ctx { Unmanaged<Ctx>.fromOpaque(info!).takeUnretainedValue() }

let table = CGPDFOperatorTableCreate()!
CGPDFOperatorTableSetCallback(table, "q") { _, info in let c = ctx(info); c.stack.append(c.ctm) }
CGPDFOperatorTableSetCallback(table, "Q") { _, info in let c = ctx(info); c.ctm = c.stack.popLast() ?? c.ctm }
CGPDFOperatorTableSetCallback(table, "cm") { scanner, info in
  var v = [CGPDFReal](repeating: 0, count: 6)
  for i in (0..<6).reversed() { CGPDFScannerPopNumber(scanner, &v[i]) }
  let c = ctx(info)
  c.ctm = CGAffineTransform(a: v[0], b: v[1], c: v[2], d: v[3], tx: v[4], ty: v[5]).concatenating(c.ctm)
}
CGPDFOperatorTableSetCallback(table, "Do") { scanner, info in
  var namePtr: UnsafePointer<Int8>?
  guard CGPDFScannerPopName(scanner, &namePtr), let name = namePtr else { return }
  let cs = CGPDFScannerGetContentStream(scanner)
  guard let obj = CGPDFContentStreamGetResource(cs, "XObject", name) else { return }
  var s: CGPDFStreamRef?
  guard CGPDFObjectGetValue(obj, .stream, &s), let stream = s, let dict = CGPDFStreamGetDictionary(stream) else { return }
  var sub: UnsafePointer<Int8>?
  guard CGPDFDictionaryGetName(dict, "Subtype", &sub), let subtype = sub else { return }
  let c = ctx(info)
  if String(cString: subtype) == "Image" {
    var w: CGPDFInteger = 0, h: CGPDFInteger = 0
    CGPDFDictionaryGetInteger(dict, "Width", &w)
    CGPDFDictionaryGetInteger(dict, "Height", &h)
    var f: UnsafePointer<Int8>?
    var jpeg = false
    if CGPDFDictionaryGetName(dict, "Filter", &f), let ff = f { jpeg = String(cString: ff) == "DCTDecode" }
    let rect = CGRect(x: 0, y: 0, width: 1, height: 1).applying(c.ctm)
    let rotated = abs(c.ctm.b) > 0.001 || abs(c.ctm.c) > 0.001 || c.ctm.a < 0 || c.ctm.d < 0
    c.found.append(Placed(stream: stream, rect: rect, rotated: rotated, width: w, height: h, jpeg: jpeg))
  } else if String(cString: subtype) == "Form" {
    var m = CGAffineTransform.identity
    var arr: CGPDFArrayRef?
    if CGPDFDictionaryGetArray(dict, "Matrix", &arr), let a = arr {
      var v = [CGPDFReal](repeating: 0, count: 6)
      for i in 0..<6 { CGPDFArrayGetNumber(a, i, &v[i]) }
      m = CGAffineTransform(a: v[0], b: v[1], c: v[2], d: v[3], tx: v[4], ty: v[5])
    }
    var res: CGPDFDictionaryRef?
    CGPDFDictionaryGetDictionary(dict, "Resources", &res)
    let saved = c.ctm
    c.stack.append(saved)
    c.ctm = m.concatenating(c.ctm)
    let sub = CGPDFContentStreamCreateWithStream(stream, res ?? CGPDFStreamGetDictionary(stream)!, cs)
    let sc = CGPDFScannerCreate(sub, c.table, info)
    CGPDFScannerScan(sc)
    c.ctm = c.stack.popLast() ?? saved
  }
}

guard let doc = CGPDFDocument(pdfURL as CFURL), let kit = PDFDocument(url: pdfURL) else {
  print("PDF 를 열 수 없습니다")
  exit(1)
}

/// 페이지의 일부를 원본 해상도에 가깝게 렌더링 (JPEG 가 아니거나 회전된 이미지용)
func renderCrop(page: CGPDFPage, rect: CGRect, targetWidth: Int) -> Data? {
  let w = min(max(targetWidth, 600), 2400)
  let scale = CGFloat(w) / rect.width
  let h = Int((rect.height * scale).rounded())
  guard h > 0, let cg = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
                                  space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
  else { return nil }
  cg.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  cg.fill(CGRect(x: 0, y: 0, width: w, height: h))
  cg.scaleBy(x: scale, y: scale)
  cg.translateBy(x: -rect.minX, y: -rect.minY)
  cg.drawPDFPage(page)
  guard let img = cg.makeImage() else { return nil }
  return NSBitmapImageRep(cgImage: img).representation(using: .png, properties: [:])
}

var manifest: [[String: Any]] = []
var headers: [[String: Any]] = []

for p in 1...doc.numberOfPages {
  guard let page = doc.page(at: p) else { continue }
  let box = page.getBoxRect(.mediaBox)
  let c = Ctx()
  c.table = table
  let cs = CGPDFContentStreamCreateWithPage(page)
  let info = Unmanaged.passUnretained(c).toOpaque()
  let scanner = CGPDFScannerCreate(cs, table, info)
  CGPDFScannerScan(scanner)

  var idx = 0
  // 위에서 아래, 왼쪽에서 오른쪽 순서
  let sorted = c.found.sorted { a, b in
    abs(a.rect.maxY - b.rect.maxY) > 8 ? a.rect.maxY > b.rect.maxY : a.rect.minX < b.rect.minX
  }
  for item in sorted {
    // 아주 작은 장식·아이콘·선은 건너뜀
    if item.rect.width < 40 || item.rect.height < 30 || item.width < 120 || item.height < 90 { continue }
    idx += 1
    let base = String(format: "p%02d-i%02d", p, idx)
    var file = ""
    if item.jpeg && !item.rotated {
      var fmt = CGPDFDataFormat.raw
      if let data = CGPDFStreamCopyData(item.stream, &fmt), fmt == .jpegEncoded {
        file = base + ".jpg"
        try? (data as Data).write(to: outDir.appendingPathComponent(file))
      }
    }
    if file.isEmpty, let png = renderCrop(page: page, rect: item.rect, targetWidth: item.width) {
      file = base + ".png"
      try? png.write(to: outDir.appendingPathComponent(file))
    }
    if file.isEmpty { continue }
    manifest.append([
      "file": file, "page": p,
      "x": Double(item.rect.minX - box.minX), "y": Double(box.maxY - item.rect.maxY),
      "w": Double(item.rect.width), "h": Double(item.rect.height),
      "px": item.width, "py": item.height,
    ])
  }

  // "프로그램명" 표 머리 위치 (운영계획 PDF)
  if let kp = kit.page(at: p - 1) {
    for sel in kit.findString("프로그램명", withOptions: []) where sel.pages.first == kp {
      let b = sel.bounds(for: kp)
      headers.append(["page": p, "y": Double(box.maxY - b.maxY)])
    }
  }
}

let json: [String: Any] = ["images": manifest, "headers": headers]
let data = try JSONSerialization.data(withJSONObject: json, options: [.prettyPrinted, .sortedKeys])
try data.write(to: outDir.appendingPathComponent("manifest.json"))
print("\(manifest.count)장 → \(outDir.path)  (표 머리 \(headers.count)개)")
