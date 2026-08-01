import type { CSSProperties } from 'react';
import './shimmer.scss';

type ShimmerProps = {
  width?: number | string;
  height?: number | string;
  marginTop?: number | string;
  borderRadius?: number | string;
  className?: string;
};

export function Shimmer({
  width = '100%',
  height = 16,
  marginTop = 0,
  borderRadius = 12,
  className,
}: ShimmerProps) {
  const style: CSSProperties = {
    width,
    height,
    marginTop,
    borderRadius,
  };

  return (
    <div
      className={`shimmer ${className ?? ''}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}
