type AsanohaHeroPatternProps = {
  className?: string
}

export default function AsanohaHeroPattern({
  className = "",
}: AsanohaHeroPatternProps) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 right-0 h-full w-[88%] [mask-image:linear-gradient(90deg,transparent,black_32%,black_78%,transparent)] sm:w-[72%] lg:w-[62%] ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="asanoha-hero"
          width="180"
          height="156"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="#E0C584"
            strokeLinecap="square"
            strokeWidth="1.25"
          >
            <path d="M90 78 45 0M90 78 90 0M90 78 135 0M90 78 0 0M90 78 180 0M90 78 0 156M90 78 45 156M90 78 90 156M90 78 135 156M90 78 180 156M90 78H0M90 78h90" />
            <path d="m45 0 45 78L135 0M0 78l90 0 90 0M45 156l45-78 45 78" />
            <path d="m0 0 45 78L0 156M180 0l-45 78 45 78" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#asanoha-hero)" />
    </svg>
  )
}
