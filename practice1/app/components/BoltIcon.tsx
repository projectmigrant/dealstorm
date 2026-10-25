export default function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <defs>
        <linearGradient id="bolt-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset=".5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <rect
        x="52"
        y="22"
        width="96"
        height="140"
        rx="12"
        fill="none"
        stroke="url(#bolt-g)"
        strokeWidth="12"
        transform="rotate(-10 100 100)"
      />
      <polygon
        points="118,6 70,104 100,104 78,194 140,82 108,82 132,6"
        fill="url(#bolt-g)"
        stroke="#0B0B12"
        strokeWidth="9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
