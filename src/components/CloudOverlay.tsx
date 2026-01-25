import { memo, useMemo } from "react";

function svgToDataUri(svg: string) {
  const cleaned = svg.trim();
  const utf8 = encodeURIComponent(cleaned).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16)),
  );
  return `data:image/svg+xml;base64,${btoa(utf8)}`;
}

const CLOUD_SVG_FAR = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <filter id="b" x="-20%" y="-40%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="white" stop-opacity="0.95"/>
      <stop offset="1" stop-color="white" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <g filter="url(#b)" fill="url(#g)">
    <path d="M120 240c60-70 140-85 220-35c40-60 120-95 200-60c55-55 150-70 220-20c65-35 145-20 190 40c80 10 130 55 140 120H120c-40-10-55-20-60-45c-10-40 20-75 70-100z" opacity="0.55"/>
    <path d="M720 260c30-55 85-85 150-65c40-55 120-75 175-30c60-25 125 0 150 50c50 5 90 35 100 75H720c-35-10-50-20-55-40c-8-32 18-60 60-90z" opacity="0.45"/>
  </g>
</svg>
`;

const CLOUD_SVG_MID = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <filter id="b" x="-20%" y="-40%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>
  <g filter="url(#b)" fill="white">
    <path d="M80 280c70-90 175-110 280-45c45-70 145-110 240-70c70-70 175-80 260-10c70-40 165-20 215 55c85 10 140 60 150 130H80c-55-15-70-30-78-62c-13-52 28-92 93-128z" opacity="0.42"/>
  </g>
</svg>
`;

const CLOUD_SVG_NEAR = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <filter id="b" x="-20%" y="-40%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>
  <g filter="url(#b)" fill="white">
    <path d="M40 310c85-105 210-130 330-55c55-85 175-135 290-85c85-85 210-95 315-10c85-50 200-25 260 70c95 12 155 70 165 150H40c-70-18-90-38-100-78c-17-65 35-115 120-162z" opacity="0.30"/>
  </g>
</svg>
`;

type Props = { enabled?: boolean };

function CloudBgLayer({ src, className }: { src: string; className: string }) {
  return (
    <div className={className} style={{ backgroundImage: `url("${src}")` }} />
  );
}

export const CloudOverlay = memo(function CloudOverlay({
  enabled = true,
}: Props) {
  const far = useMemo(() => svgToDataUri(CLOUD_SVG_FAR), []);
  const mid = useMemo(() => svgToDataUri(CLOUD_SVG_MID), []);
  const near = useMemo(() => svgToDataUri(CLOUD_SVG_NEAR), []);

  if (!enabled) return null;

  return (
    <div className="clouds" aria-hidden="true">
      <CloudBgLayer src={far} className="clouds__bg clouds__bg--far" />
      <CloudBgLayer src={mid} className="clouds__bg clouds__bg--mid" />
      <CloudBgLayer src={near} className="clouds__bg clouds__bg--near" />
    </div>
  );
});
