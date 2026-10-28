import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { ScrollTopButton } from "./ScrollTopButton";

export function Footer() {
  return (
    <footer className="border-t border-line bg-footer">
      <div className="container-site py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Image src="/logo.png" alt={site.name} width={112} height={36} className="h-9 w-auto opacity-90" />
            <address className="space-y-1 text-[14px] not-italic leading-[22px] text-muted">
              <p>{site.address.full}</p>
              <p>
                상호 : {site.legalName}
                <span className="mx-2 text-line">|</span>대표 : {site.business.ceo}
              </p>
              <p>
                사업자등록번호 : {site.business.registrationNo}
                <span className="mx-2 text-line">|</span>법인등록번호 : {site.business.corporateNo}
                <span className="mx-2 text-line">|</span>통신판매업신고 : {site.business.mailOrderNo}
              </p>
              <p>
                전화 : <a href={`tel:${site.contact.phone}`} className="hover:text-primary">{site.contact.phone}</a>
                <span className="mx-2 text-line">|</span>팩스 : {site.contact.fax}
                <span className="mx-2 text-line">|</span>이메일 :{" "}
                <a href={`mailto:${site.contact.email}`} className="hover:text-primary">{site.contact.email}</a>
              </p>
            </address>
          </div>
          <nav aria-label="바로가기" className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium text-body">
            <Link href="/about/greeting" className="hover:text-primary">단체소개</Link>
            <Link href="/about/location" className="hover:text-primary">오시는 길</Link>
            <Link href="/community/notice" className="hover:text-primary">공지사항</Link>
            <Link href="/community/gallery" className="hover:text-primary">포토갤러리</Link>
          </nav>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-[#e0e0e0] pt-5 text-[12px] text-muted">
          <p>ⓒ {site.legalName} All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/admin" rel="nofollow" className="text-muted hover:text-primary">
              관리자
            </Link>
            <ScrollTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
