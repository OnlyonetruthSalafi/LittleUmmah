import { ArabicText } from "@/components/ui/ArabicText";
import type { Dict } from "@/i18n/dict";
import { PHOTO, SAHABA, UI, ULAMA, type Evidence } from "./content";
function EvidenceList({ items, d }: { items: Evidence[]; d: Dict }) {
  return (
    <ol className="mt-3 space-y-4">
      {items.map((item) => (
        <li key={item.arabic} className="rounded-card-sm bg-sky-pale p-4">
          <blockquote>
            <p lang="ar" dir="rtl" className="text-ink text-xl leading-loose font-semibold">
              {item.arabic}
            </p>
            <p className="mt-2 leading-relaxed">“<ArabicText text={d.pick(item.tr)} />”</p>
          </blockquote>
          <p className="text-ink-soft mt-2 text-sm">
            {d.pick(UI.source)} <ArabicText text={d.pick(item.source)} /> <ShamelaLink href={item.href} d={d} />
          </p>
        </li>
      ))}
    </ol>
  );
}

function ShamelaLink({ href, d }: { href: string; d: Dict }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-blue inline-flex min-h-12 items-center font-semibold underline underline-offset-4"
    >
      {d.pick(UI.openShamela)}
      <span className="sr-only">{d.pick(UI.newTab)}</span>
    </a>
  );
}

export function FatwaSection({ d }: { d: Dict }) {
  return (
    <section className="mt-8" aria-labelledby="fatwa-heading">
      <h2 id="fatwa-heading" className="font-display text-brand-blue text-xl font-bold sm:text-2xl">
        {d.pick(UI.fatwaHeading)}
      </h2>
      <p className="mt-2 leading-relaxed">{d.pick(UI.fatwaIntro)}</p>

      <h3 className="font-display mt-6 text-lg font-bold">{d.pick(UI.fromSahaba)}</h3>
      <EvidenceList items={SAHABA} d={d} />

      <h3 className="font-display mt-6 text-lg font-bold">{d.pick(UI.fromUlama)}</h3>
      <EvidenceList items={ULAMA} d={d} />

      <p className="mt-4 leading-relaxed">
        <strong>{d.pick(UI.note)}</strong> {d.pick(UI.albaniNote)}{" "}
        <ShamelaLink href="https://shamela.ws/book/145204/7139" d={d} /> {d.pick(UI.albaniFollow)}
      </p>

      <h3 className="font-display mt-6 text-lg font-bold">{d.pick(UI.photoHeading)}</h3>
      <p className="mt-2 leading-relaxed">{d.pick(UI.photoIntro)}</p>
      <EvidenceList items={PHOTO} d={d} />
      <p className="mt-4 leading-relaxed">
        <strong>{d.pick(UI.note)}</strong> {d.pick(UI.lajnahNote)}{" "}
        <ShamelaLink href="https://shamela.ws/book/8381/858" d={d} /> {d.pick(UI.lajnahFollow)}
      </p>
    </section>
  );
}

