// Brand mark: three stacked sorbet scoops in the token palette.
// Pure SVG so it renders on the server and inherits size from props.
import { colorPalette as P } from '@sorbet-ui/tokens';

export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="11" cy="13" r="7" fill={P.primary[300]} />
      <circle cx="21" cy="13" r="7" fill={P.secondary[300]} />
      <circle cx="16" cy="7.5" r="6.5" fill={P.danger[300]} />
      <path d="M8.5 17.5h15L16 30z" fill={P.warning[300]} />
      <path d="M8.5 17.5h15L16 30z" fill="none" stroke={P.warning[500]} strokeOpacity=".35" />
    </svg>
  );
}
