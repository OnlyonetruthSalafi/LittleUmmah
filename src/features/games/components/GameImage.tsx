'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { GameIcon } from '@/components/icons/GameIcon';
export function GameImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="gc-image-fallback" role={props.alt ? 'img' : undefined} aria-label={props.alt || undefined} aria-hidden={!props.alt || undefined}><GameIcon name="sparkle" /></span>;
  return <Image {...props} alt={props.alt} onError={() => setFailed(true)} />;
}
