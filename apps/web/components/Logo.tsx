// Brand mark: three stacked sorbet scoops in the token palette.
// Pure SVG so it renders on the server and inherits size from props.
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="11" cy="13" r="7" fill="#7dd3fc" />
      <circle cx="21" cy="13" r="7" fill="#d8b4fe" />
      <circle cx="16" cy="7.5" r="6.5" fill="#fda4af" />
      <path d="M8.5 17.5h15L16 30z" fill="#fcd34d" />
      <path d="M8.5 17.5h15L16 30z" fill="none" stroke="#f59e0b" strokeOpacity=".35" />
    </svg>
  );
}
