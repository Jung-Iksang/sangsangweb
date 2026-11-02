import Link from "next/link";
import { site } from "@/config/site";
import { ScrollTopButton } from "./ScrollTopButton";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer bg-ink text-on-ink">
      <div className="site-content-frame footer-content">
        <div className="footer-main">
          <section className="footer-business" aria-label="기관 및 사업자 정보">
            <h2 className="footer-heading">{site.legalName} · 대표 {site.business.ceo}</h2>
            <dl className="footer-business-info">
              <div><dt>사업자등록번호</dt><dd>{site.business.registrationNo}</dd></div>
              <div><dt>법인등록번호</dt><dd>{site.business.corporateNo}</dd></div>
              <div><dt>통신판매업신고</dt><dd>{site.business.mailOrderNo}</dd></div>
            </dl>
          </section>

          <section className="footer-organization" aria-label="기관 연락 정보">
            <address className="footer-address">
              <p>{site.address.full}</p>
              <dl className="footer-contact-list">
                <div><dt>전화</dt><dd><a href={`tel:${site.contact.phone}`}>{site.contact.phone}</a></dd></div>
                <div><dt>팩스</dt><dd>{site.contact.fax}</dd></div>
                <div className="footer-email"><dt>이메일</dt><dd><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></dd></div>
              </dl>
            </address>
          </section>
        </div>

        <div className="footer-bottom">
          <div className="footer-meta">
            <p>ⓒ {site.legalName}</p>
            <div className="footer-actions">
              <Link href="/admin" rel="nofollow">관리자</Link>
              <ScrollTopButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
