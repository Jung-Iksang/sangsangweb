import "server-only";
import sanitizeHtml from "sanitize-html";

/** 관리자 에디터 HTML 정제 — 허용 태그만 남김 (XSS 방지) */
export function sanitizePostHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "a",
      "ul", "ol", "li", "blockquote", "hr", "img", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href && /^https?:\/\//.test(attribs.href) ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        },
      }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
    exclusiveFilter: (frame) => frame.tag === "p" && !frame.text.trim() && !frame.mediaChildren.length,
  }).replace(/<img(?![^>]*\bsrc=)[^>]*>/g, "");
}

export function htmlToText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function makeExcerpt(html: string, max = 160) {
  const text = htmlToText(html);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function firstImageSrc(html: string) {
  return html.match(/<img[^>]*\bsrc="([^"]+)"/)?.[1] ?? null;
}
