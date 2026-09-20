import { useEffect, useRef } from 'react';

export interface FrameSequenceProps {
  frames: string[];
  progress: number;
  alt: string;
  fit?: 'contain' | 'cover';
  priority?: boolean;
}

function drawFrame(canvas: HTMLCanvasElement, image: HTMLImageElement, fit: FrameSequenceProps['fit']) {
  const context = canvas.getContext('2d');
  if (!context || !image.naturalWidth || !image.naturalHeight) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  const scale = fit === 'cover' ? Math.max(width / image.naturalWidth, height / image.naturalHeight) : Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

export default function FrameSequence({ frames, progress, alt, fit = 'contain', priority = false }: FrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cache = useRef(new Map<number, HTMLImageElement>());
  const lastFrame = useRef(0);

  useEffect(() => {
    if (!frames.length) return;
    let cancelled = false;
    const indexes = [0, frames.length - 1, Math.round((frames.length - 1) * 0.5), Math.round((frames.length - 1) * 0.25), Math.round((frames.length - 1) * 0.75)];
    const load = (index: number) => {
      if (cancelled || cache.current.has(index)) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = frames[index];
      image.onload = async () => {
        if (cancelled) return;
        try { await image.decode?.(); } catch { /* decode is optional */ }
        cache.current.set(index, image);
        if (index === lastFrame.current && canvasRef.current) drawFrame(canvasRef.current, image, fit);
      };
    };
    indexes.forEach(load);
    if (priority) {
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      const idle = idleWindow.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 80));
      const handle = idle(() => frames.forEach((_, index) => load(index)));
      return () => { cancelled = true; idleWindow.cancelIdleCallback?.(handle); };
    }
    return () => { cancelled = true; };
  }, [fit, frames, priority]);

  useEffect(() => {
    if (!frames.length || !canvasRef.current) return;
    const requested = Math.round(Math.max(0, Math.min(1, progress)) * (frames.length - 1));
    let nearest = requested;
    while (nearest > 0 && !cache.current.has(nearest)) nearest -= 1;
    if (!cache.current.has(nearest)) return;
    lastFrame.current = nearest;
    drawFrame(canvasRef.current, cache.current.get(nearest)!, fit);
  }, [fit, frames.length, progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const image = cache.current.get(lastFrame.current);
      if (image) drawFrame(canvas, image, fit);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [fit]);

  return <canvas ref={canvasRef} className="frame-sequence" role="img" aria-label={alt} />;
}
