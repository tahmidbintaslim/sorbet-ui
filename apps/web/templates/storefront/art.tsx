// Product pictures drawn in SVG from a shape and a glaze: no image files to host,
// sharp at any size, and every color is a design token. Decorative: the product
// name is always next to the picture, so the SVG is aria-hidden.
import { colorPalette } from '@sorbet-ui/tokens';
import type { Glaze, Shape } from './data';

const BODY: Record<Shape, string> = {
  mug: 'M58 70h74v62c0 14-11 24-24 24H82c-13 0-24-10-24-24V70Z',
  cup: 'M64 84h72l-6 56c-1 10-9 16-19 16H89c-10 0-18-6-19-16l-6-56Z',
  bowl: 'M34 96h132c0 34-28 58-66 58S34 130 34 96Z',
  'deep-bowl': 'M42 78h116c0 46-24 78-58 78S42 124 42 78Z',
  plate: 'M24 118c0-14 34-24 76-24s76 10 76 24-34 26-76 26-76-12-76-26Z',
  vase: 'M86 36h28v14c0 8 18 22 18 52 0 34-14 54-32 54s-32-20-32-54c0-30 18-44 18-52V36Z',
  'bud-vase': 'M92 74h16v10c14 6 24 20 24 38 0 20-14 34-32 34s-32-14-32-34c0-18 10-32 24-38V74Z',
};

/** Glaze swatch color (the 400 shade reads as a glaze in light and dark). */
export const glazeColor = (g: Glaze) => colorPalette[g.hue][g.hue === 'neutral' ? 200 : 400];

export default function ProductArt({ shape, glaze, size = '100%' }: { shape: Shape; glaze: Glaze; size?: number | string }) {
  const scale = colorPalette[glaze.hue];
  const fill = glazeColor(glaze);
  return (
    <svg viewBox="0 0 200 180" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      {/* Backdrop: a soft blob in the glaze's lightest shade. */}
      <path d="M30 60c10-34 60-50 100-40s62 46 52 86-58 64-100 56S20 94 30 60Z" fill={scale[100]} />
      <ellipse cx="100" cy="160" rx="62" ry="7" fill={scale[200]} opacity=".7" />
      {shape === 'mug' && <path d="M132 86c18 0 26 8 26 20s-8 20-26 20" fill="none" stroke={scale[500]} strokeWidth="9" strokeLinecap="round" />}
      <path d={BODY[shape]} fill={fill} />
      {/* Raw clay at the foot and a highlight. */}
      {shape !== 'plate' && <path d="M70 152h60" stroke={colorPalette.warning[200]} strokeWidth="6" strokeLinecap="round" />}
      {shape === 'plate' ? (
        <ellipse cx="100" cy="116" rx="50" ry="13" fill={scale[200]} opacity=".75" />
      ) : (
        <path d={shape.includes('vase') ? 'M90 98c-4 14-4 30 2 42' : 'M72 104c0 12 4 24 12 32'} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="6" strokeLinecap="round" />
      )}
      {(shape === 'bowl' || shape === 'deep-bowl') && <ellipse cx="100" cy={shape === 'bowl' ? 96 : 78} rx={shape === 'bowl' ? 66 : 58} ry="9" fill={scale[600]} />}
    </svg>
  );
}
