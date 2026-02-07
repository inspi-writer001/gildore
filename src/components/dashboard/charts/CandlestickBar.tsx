interface CandlestickBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    open: number;
    close: number;
    high: number;
    low: number;
  };
  low?: number;
  high?: number;
  openY?: number;
  closeY?: number;
  yAxis?: { scale: (v: number) => number };
}

export const CandlestickBar = (props: CandlestickBarProps) => {
  const { x, width, payload, yAxis } = props;

  if (!x || !width || !payload || !yAxis?.scale) return null;

  const { open, close, high, low } = payload;
  const isGreen = close >= open;
  const color = isGreen ? "#22c55e" : "#ef4444";

  const scale = yAxis.scale;
  const bodyTop = scale(Math.max(open, close));
  const bodyBottom = scale(Math.min(open, close));
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

  const wickTop = scale(high);
  const wickBottom = scale(low);
  const wickX = x + width / 2;

  return (
    <g>
      <line
        x1={wickX}
        y1={wickTop}
        x2={wickX}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1}
      />
      <rect
        x={x}
        y={bodyTop}
        width={width}
        height={bodyHeight}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};
