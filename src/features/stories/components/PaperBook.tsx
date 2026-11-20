import Image from "next/image";
import "./paper-book.css";

/** Rendered from the same geometry as the interactive spread. */
export function PaperBook({ scene }: { scene: string }) {
  return <Image className="pp-poster" src={`/stories/nuh-paper/${scene}.webp`}
    alt="" width={1080} height={648} sizes="(max-width: 640px) 100vw, 880px" unoptimized draggable={false} />;
}
