/** Points are computed once at module load, so server and client markup match. */
function starburst(outer: number, inner: number, spikes: number): string {
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / spikes) * i - Math.PI / 2;
    points.push(
      `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`,
    );
  }
  return points.join(" ");
}

const BADGE_POINTS = starburst(50, 40, 12);

export function PromoBadge({ percent }: { percent: number }) {
  return (
    <span
      className="pointer-events-none absolute inset-inline-start-2 top-2 grid h-14 w-14 -rotate-6 place-items-center"
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-rouge">
        <polygon points={BADGE_POINTS} fill="currentColor" />
      </svg>
      <span className="prix relative text-[0.8rem] leading-none text-white">
        -{percent}%
      </span>
    </span>
  );
}
