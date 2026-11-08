'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { GameIcon } from '@/components/icons/GameIcon';
export function GameImage(props: ImageProps) {
  // Each source owns its failure state, including A → B → A retries.
  return <SourceImage key={typeof props.src === 'string' ? props.src : JSON.stringify(props.src)} {...props} />;
}
function SourceImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="gc-image-fallback" role={props.alt ? 'img' : undefined} aria-label={props.alt || undefined} aria-hidden={!props.alt || undefined}><GameIcon name="sparkle" /></span>;
  return <Image {...props} alt={props.alt} onError={event => { setFailed(true); props.onError?.(event); }} />;
}
