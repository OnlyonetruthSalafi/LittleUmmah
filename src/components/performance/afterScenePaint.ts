/** Run optional startup work once the scene (and any guide frames) can be painted.
 * This follows the actual images, not a guessed LCP timeout or analytics observer.
 * The returned cancellation also covers cached images and pending decode promises.
 */
export function afterScenePaint(callback: () => void, frames?: string, maxWaitMs = 4000): () => void {
  let cancelled = false;
  let frame = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cleanups: (() => void)[] = [];
  const images = [...document.querySelectorAll<HTMLImageElement>(
    `.sky-scene img[src*="%2FBG%2Fbg.webp"]${frames ? `, ${frames}` : ""}`,
  )];
  const ready = images.map(image => new Promise<void>(resolve => {
    const loaded = () => {
      image.removeEventListener("load", loaded);
      image.removeEventListener("error", loaded);
      image.decode().catch(() => {}).then(resolve);
    };
    if (image.complete) loaded();
    else {
      image.addEventListener("load", loaded, { once: true });
      image.addEventListener("error", loaded, { once: true });
      cleanups.push(() => {
        image.removeEventListener("load", loaded);
        image.removeEventListener("error", loaded);
        resolve();
      });
    }
  }));
  // A stalled request must not block optional startup work forever.
  const waitAtMost = new Promise<void>(resolve => { timer = setTimeout(resolve, maxWaitMs); });
  void Promise.race([Promise.all(ready), waitAtMost]).then(() => {
    clearTimeout(timer);
    if (cancelled) return;
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => { if (!cancelled) callback(); });
    });
  });
  return () => {
    cancelled = true;
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    cleanups.forEach(cleanup => cleanup());
  };
}
