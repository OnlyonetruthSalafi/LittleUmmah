import Image from "next/image";
import "./paper-book.css";

/** Rendered from the same geometry as the interactive spread. */
export function PaperBook({ src }: { src: string }) {
  return <Image className="pp-poster" src={src}
    alt="" width={1080} height={648} sizes="(max-width: 640px) 100vw, 880px" unoptimized draggable={false} />;
}
