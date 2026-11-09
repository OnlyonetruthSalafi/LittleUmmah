"use client";

import Image from "next/image";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { ShieldHeartIcon } from "@/components/icons/ShieldHeartIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { fmt } from "@/i18n/dict";
import { LocaleLink as Link, useDict } from "@/i18n/LocaleProvider";
import { CATEGORIES } from "@/lib/categories";
import { friendImage, type FriendId, type FriendPose } from "@/lib/friends";

import "./site-footer.css";

/*
  ท้ายเว็บ (เจ้าของโปรเจกต์สั่ง 9 พ.ย. 2026) — ทุกหน้ายกเว้นหน้าเล่นเกมเต็มจอ
  ขอบเมฆขาวไหลจากฉากฟ้าลงสู่ฟ้ากลางคืนสีกรมท่า มีดาวทองนิ่งๆ (ไม่กระพริบ ข้อ 2.1) และนูรีโบกมือนั่งบนเมฆ

  เนื้อหาเป็นข้อเท็จจริงของเว็บนี้เท่านั้น: สัญญา 3 ข้อตรงกับหน้าผู้ปกครอง (ฟรี ไม่มีโฆษณา ข้อมูลไม่ออกจากเครื่อง)
  ที่มาเนื้อหาศาสนา ลิงก์เกาะ และผู้สนับสนุน

  ผู้สนับสนุน (เจ้าของโปรเจกต์ตัดสิน 9 พ.ย. 2026 แก้ AGENTS ข้อ 1.5): โลโก้เล็กใน Footer ทุกหน้าได้
  **ไม่เป็นลิงก์ ไม่มีภาพสินค้า ราคา หรือปุ่มซื้อ** เด็กกดออกไปร้านไม่ได้
*/
const SPONSOR_LOGO: string | null = "/sponsors/shuhada.webp";

/*
  ผองเพื่อนนูรียืนบนเมฆเหนือ Footer (เจ้าของโปรเจกต์สั่ง 9 พ.ย. 2026) คนละท่า ภาพตกแต่ง alt=""
  นิ่ง ไม่ลอย/เด้งวน (ข้อ 2.1) · มือถือแนวตั้งแสดง 3 ตัว (ตัวที่มี sf-friend-wide ซ่อนไว้)
*/
const FOOTER_FRIENDS: { id: FriendId; pose: FriendPose; wide?: boolean }[] = [
  { id: "hadi", pose: "stand" },
  { id: "rassam", pose: "action", wide: true },
  { id: "sabir", pose: "cheer" },
  { id: "qalam", pose: "stand", wide: true },
  { id: "safi", pose: "action" },
];

export function SiteFooter() {
  const { t, sub, pick, pickSub } = useDict();
  const { speak } = useSound();
  const year = new Date().getFullYear();
  const islands = CATEGORIES.filter((c) => c.href);
  const promises = [
    { text: t.footer.promiseFree, en: sub?.footer.promiseFree },
    { text: t.footer.promiseNoAds, en: sub?.footer.promiseNoAds },
    { text: t.footer.promiseNoTracking, en: sub?.footer.promiseNoTracking },
  ];

  return (
    <footer aria-label={t.footer.label} className="site-footer">
      <div className="sf-clouds" aria-hidden="true" />
      <Image src="/Character/greet/wave-1.webp" alt="" width={640} height={640} sizes="120px" className="sf-nuri" />
      <div className="sf-friends" aria-hidden="true">
        {FOOTER_FRIENDS.map((f) => (
          <Image
            key={f.id}
            src={friendImage(f.id, f.pose)}
            alt=""
            width={480}
            height={480}
            sizes="112px"
            className={`sf-friend sf-friend-${f.id}${f.wide ? " sf-friend-wide" : ""}`}
          />
        ))}
      </div>

      <div className="sf-sky">
        <div className="sf-inner">
          <div className="sf-brand">
            <p className="sf-name font-display" lang="en">Little Ummah</p>
            <p className="sf-motto">{t.footer.motto}</p>
            {sub && <p lang="en" className="sf-motto-sub">{sub.footer.motto}</p>}
          </div>

          <section aria-labelledby="sf-promise" className="sf-promise">
            <h2 id="sf-promise" className="sf-heading">{t.footer.promisesTitle}</h2>
            <ul>
              {promises.map((p) => (
                <li key={p.text}>
                  <span className="sf-check"><CheckIcon /></span>
                  <span>
                    {p.text}
                    {p.en && <span lang="en" className="sf-sub">{p.en}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="sf-sources">
              {t.footer.sources}{" "}
              <Link href="/parents" className="sf-text-link">{t.footer.sourcesLink}</Link>
            </p>
          </section>

          <nav aria-labelledby="sf-islands" className="sf-islands">
            <h2 id="sf-islands" className="sf-heading">{t.footer.islandsTitle}</h2>
            <ul>
              {islands.map((c) => (
                <li key={c.slug}>
                  <Link href={c.href} className="sf-island" onClick={() => speak(pick(c.name), `cat-${c.slug}`)}>
                    <Image src={c.image} alt="" width={900} height={900} sizes="48px" className="sf-island-art" />
                    <span>
                      {pick(c.name)}
                      {sub && <span lang="en" className="sf-sub">{pickSub(c.name)}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ผู้สนับสนุน: ไม่ใช่ลิงก์ (ข้อ 1.5) */}
          <section aria-labelledby="sf-sponsor" className="sf-sponsor">
            <h2 id="sf-sponsor" className="sf-heading">{t.footer.sponsorTitle}</h2>
            <div className="sf-sponsor-card">
              {SPONSOR_LOGO ? (
                <Image src={SPONSOR_LOGO} alt={pick({ th: t.footer.sponsorName, en: "Shuhada" })} width={512} height={512} sizes="80px" className="sf-sponsor-logo" />
              ) : (
                <span className="sf-sponsor-word font-display" lang="en">Shuhada</span>
              )}
              <p>
                {t.footer.sponsorThanks}
                {sub && <span lang="en" className="sf-sub">{sub.footer.sponsorThanks}</span>}
              </p>
            </div>
          </section>
        </div>

        <div className="sf-bottom">
          <p lang="en">{fmt(t.footer.copyright, { year })}</p>
          <ul>
            <li><Link href="/" className="sf-text-link">{t.footer.home}</Link></li>
            <li>
              <Link href="/parents" className="sf-text-link sf-parents">
                <ShieldHeartIcon />
                {t.footer.parents}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
