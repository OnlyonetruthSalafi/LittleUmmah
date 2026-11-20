"use client";

import Image from "next/image";
import { useState } from "react";
import { LocaleLink, useDict } from "@/i18n/LocaleProvider";
import { fmt } from "@/i18n/dict";

type ShelfEntry = { slug: string; title: { th: string; en: string }; jacket: string };

export function PaperShelf({ books }: { books: ShelfEntry[] }) {
  const [index, setIndex] = useState(0);
  const { t, sub, pick, pickSub } = useDict();
  const book = books[index];
  const words = t.stories.shelf;
  const secondary = sub?.stories.shelf;
  return (
    <section className="pp-collection" data-shelf="popup" aria-labelledby="pp-collection-title">
      <header className="pp-cornice">
        <h2 id="pp-collection-title">{words.paperTitle}{secondary && <small lang="en">{secondary.paperTitle}</small>}</h2>
      </header>
      <div className="pp-collection-link">
        <div className="pp-feature-art">
          <Image src={book.jacket} alt="" width={1024} height={1356} sizes="(max-width: 639px) 35vw, 180px" className="pp-jacket" />
        </div>
        <div className="pp-collection-copy">
          <div aria-live="polite" aria-atomic="true">
            <p className="pp-volume">{fmt(words.volume, { number: index + 1 })}{secondary && <span lang="en"> · {fmt(secondary.volume, { number: index + 1 })}</span>}</p>
            <h3 id="pp-book-title">{pick(book.title)}{secondary && <small lang="en">{pickSub(book.title)}</small>}</h3>
          </div>
          <LocaleLink href={`/learn/stories/${book.slug}#paper-book`} className="pp-open" id="pp-open-action" aria-describedby="pp-book-title">
            <span>{words.openPaper}{secondary && <small lang="en">{secondary.openPaper}</small>}</span><span aria-hidden="true">→</span>
          </LocaleLink>
          <button type="button" className="pp-browse" onClick={() => setIndex(i => (i + 1) % books.length)}>
            {words.browsePaper}{secondary && <small lang="en">{secondary.browsePaper}</small>}
          </button>
        </div>
      </div>
    </section>
  );
}
