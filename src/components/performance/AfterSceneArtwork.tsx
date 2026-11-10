"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { afterScenePaint } from "./afterScenePaint";

/** For a secondary background only: its existing positioned frame stays in place. */
export function AfterSceneArtwork({ children, ...props }: ComponentProps<"div">) {
  const [ready, setReady] = useState(false);
  useEffect(() => afterScenePaint(() => setReady(true)), []);
  return <div {...props}>{ready ? children : <noscript>{children}</noscript>}</div>;
}
