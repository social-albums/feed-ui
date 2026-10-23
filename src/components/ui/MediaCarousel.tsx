import { useRef, useState } from 'react';

interface MediaCarouselProps {
  urls: string[];
  alt: string;
  className?: string;
  imgClassName?: string;
}

// Carrusel con scroll-snap nativo: swipe en mobile, flechas en desktop.
export function MediaCarousel({
  urls,
  alt,
  className = '',
  imgClassName = 'h-full w-full object-cover',
}: MediaCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (urls.length === 1) {
    return <img src={urls[0]} alt={alt} className={imgClassName} />;
  }

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const arrowClass =
    'absolute top-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white';

  return (
    <div className={`group relative ${className}`}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {urls.map((url, i) => (
          <img
            key={url}
            src={url}
            alt={`${alt} (${i + 1}/${urls.length})`}
            loading={i === 0 ? 'eager' : 'lazy'}
            draggable={false}
            className={`shrink-0 snap-center ${imgClassName}`}
          />
        ))}
      </div>

      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        {index + 1}/{urls.length}
      </span>

      {index > 0 && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => goTo(index - 1)}
          className={`${arrowClass} left-2`}
        >
          ‹
        </button>
      )}
      {index < urls.length - 1 && (
        <button
          type="button"
          aria-label="Next image"
          onClick={() => goTo(index + 1)}
          className={`${arrowClass} right-2`}
        >
          ›
        </button>
      )}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {urls.map((url, i) => (
          <button
            key={url}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
