import { useId } from "react";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import "./logo.css";

export function Logo({ locale }: { locale: Locale }) {
  const { t } = dict(locale);
  const id = `logo${useId().replace(/[^\w-]/g, "")}`;
  const [connector, ...future] = t.logo.tomorrow.split(" ");
  return (
    <span className="brand-logo">
      <span lang="en" className="sr-only">{t.logo.brand}</span>
      <svg className="brand-logo-art font-display" viewBox="0 0 600 180" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-blue`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="125">
            <stop stopColor="#83dcff" /><stop offset=".45" stopColor="#368fee" /><stop offset="1" stopColor="#1852a2" />
          </linearGradient>
          <linearGradient id={`${id}-gold`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="125">
            <stop stopColor="#fff3a1" /><stop offset=".45" stopColor="#ffd359" /><stop offset="1" stopColor="#cc7e0c" />
          </linearGradient>
          <linearGradient id={`${id}-ribbon`} x2="0" y2="1">
            <stop stopColor="#32b8dd" /><stop offset="1" stopColor="#1754a2" />
          </linearGradient>
          <path id={`${id}-arc`} d="M 40 169 Q 300 136 560 169" />
        </defs>
        <image href="/brand/logo-book.webp" x="165" y="0" width="270" height="155" preserveAspectRatio="xMidYMin meet" />
        <g transform="translate(0 -10)">
          <path d="M18 111 L42 128 Q300 97 558 128 L582 111 L574 178 L554 169 Q300 145 46 179 L24 184Z" fill={`url(#${id}-ribbon)`} stroke="#ffde78" strokeWidth="6" />
          {(["depth", "edge", "color"] as const).map(layer => (
            <text key={layer} fontSize="67" fontWeight="800" strokeLinejoin="round" paintOrder="stroke fill"
              transform={layer === "depth" ? "translate(0 6)" : undefined}
              stroke={layer === "depth" ? "#174677" : "#fff"}
              strokeWidth={layer === "depth" ? 14 : layer === "edge" ? 11 : 1}
              fill={layer === "depth" ? "#174677" : "white"}>
              <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle" textLength="490" lengthAdjust="spacingAndGlyphs">
                <tspan fill={layer === "color" ? `url(#${id}-blue)` : undefined}>Little </tspan>
                <tspan dx="8" fill={layer === "color" ? `url(#${id}-gold)` : undefined}>Ummah</tspan>
              </textPath>
            </text>
          ))}
        </g>
      </svg>
      <span className="sr-only">{t.logo.today} {t.logo.tomorrow}</span>
      <svg className="brand-logo-tagline" viewBox="0 0 600 42" aria-hidden="true" focusable="false">
        {(["depth", "edge", "color"] as const).map(layer => (
          <text key={layer} x="300" y="30" textAnchor="middle" fontSize="27" fontWeight="900"
            strokeLinejoin="round" paintOrder="stroke fill"
            transform={layer === "depth" ? "translate(0 2)" : undefined}
            stroke={layer === "depth" ? "#174677" : layer === "edge" ? "#fff" : "none"}
            strokeWidth={layer === "color" ? 0 : 5}
            fill={layer === "depth" ? "#174677" : "#fff"}>
            <tspan className={layer === "color" ? "brand-logo-today" : undefined}>{t.logo.today}</tspan>{" "}
            <tspan className={layer === "color" ? "brand-logo-connector" : undefined}>{connector}</tspan>{" "}
            <tspan className={layer === "color" ? "brand-logo-future" : undefined}>{future.join(" ")}</tspan>
          </text>
        ))}
      </svg>
    </span>
  );
}
