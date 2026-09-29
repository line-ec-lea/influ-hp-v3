import { useState } from "react";

const photos = [
  {
    src: "/p2.jpg",
    alt: "INFLUオフィスの円卓とミーティングスペース",
    caption: "アイディアを交わし、かたちにする場所。",
  },
  {
    src: "/p1.jpg",
    alt: "植物に囲まれたINFLUオフィスのエントランス",
    caption: "大阪・新町から、事業の次の一歩へ。",
  },
  {
    src: "/p3.jpg",
    alt: "INFLUの研修・セミナースペース",
    caption: "学び、試し、現場で使える力へ。",
  },
];

export default function OfficeGallery() {
  const [selected, setSelected] = useState(0);
  return (
    <figure className="relative h-full min-h-[400px] bg-ink text-white md:min-h-[560px]">
      <img
        src={photos[selected].src}
        alt={photos[selected].alt}
        width={1920}
        height={1000}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15"
        aria-hidden="true"
      />
      <span className="absolute top-6 left-6 border border-white/50 px-3 py-2 font-mono text-xs tracking-wide">
        OUR PLACE / OSAKA
      </span>
      <figcaption className="absolute right-6 bottom-6 left-6">
        <p className="mb-5 text-sm leading-relaxed" aria-live="polite">
          {photos[selected].caption}
        </p>
        <div
          className="flex gap-2"
          role="group"
          aria-label="オフィス写真の切り替え"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`写真${index + 1}：${photo.alt}`}
              aria-pressed={selected === index}
              className={`min-h-11 min-w-14 border text-xs transition-colors ${selected === index ? "border-white bg-white text-black" : "border-white/50 text-white hover:bg-white/20"}`}
            >
              0{index + 1}
            </button>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
