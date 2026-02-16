export default function Logo({ size = 40 }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="
          drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)] hover:scale-105 hover:rotate-1
        "
      >
        {/* Outer plate */}
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="14"
          fill="url(#plate)"
          stroke="#cbd5e1"
        />
  
        {/* Inner pressed surface */}
        <rect
          x="10"
          y="10"
          width="44"
          height="44"
          rx="10"
          fill="url(#inner)"
        />
  
        {/* Crown symbol */}
        <path
          d="M18 38 L24 24 L32 34 L40 24 L46 38 Z"
          fill="url(#crown)"
        />
  
        {/* Gradients */}
        <defs>
  
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="64">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#e2e8f0"/>
          </linearGradient>
  
          <linearGradient id="inner" x1="0" y1="0" x2="0" y2="64">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="100%" stopColor="#2563eb"/>
          </linearGradient>
  
          <linearGradient id="crown" x1="0" y1="0" x2="0" y2="64">
            <stop offset="0%" stopColor="#fde047"/>
            <stop offset="100%" stopColor="#f59e0b"/>
          </linearGradient>
  
        </defs>
      </svg>
    );
  }
  