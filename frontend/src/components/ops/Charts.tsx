import { cn } from "@/lib/utils/cn";
import type { RevenuePoint, StatusBreakdownItem } from "@/types/analytics";

const normalize = (values: number[], height: number, minFloor = 0) => {
  const max = Math.max(minFloor, ...values);
  return values.map((value) => {
    if (!max) return height;
    return Number((height - (value / max) * height).toFixed(2));
  });
};

export const SparkAreaChart = ({
  points,
  className,
  stroke = "#1f8f6b",
  fill = "rgba(31, 143, 107, 0.2)",
}: {
  points: RevenuePoint[];
  className?: string;
  stroke?: string;
  fill?: string;
}) => {
  if (!points.length) {
    return <div className={cn("chart-empty", className)}>No data yet</div>;
  }

  const width = 480;
  const height = 160;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const yPoints = normalize(points.map((point) => point.value), height);

  const line = yPoints
    .map((value, index) => `${(index * step).toFixed(2)},${value.toFixed(2)}`)
    .join(" ");

  const area = `${line} ${width},${height} 0,${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("spark-chart", className)} role="img" aria-label="Revenue trend chart">
      <polyline points={area} fill={fill} stroke="none" />
      <polyline points={line} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {yPoints.map((value, index) => (
        <circle key={`${points[index].label}-${index}`} cx={index * step} cy={value} r="3" fill={stroke} />
      ))}
    </svg>
  );
};

export const MiniBarChart = ({
  points,
  className,
}: {
  points: RevenuePoint[];
  className?: string;
}) => {
  if (!points.length) {
    return <div className={cn("chart-empty", className)}>No data yet</div>;
  }

  const max = Math.max(...points.map((point) => point.value), 1);
  return (
    <div className={cn("bar-chart", className)}>
      {points.map((point) => {
        const height = Math.max(8, Math.round((point.value / max) * 100));
        return (
          <div key={point.label} className="bar-col" title={`${point.label}: $${point.value.toFixed(2)}`}>
            <span className="bar-fill" style={{ height: `${height}%` }} />
            <small>{point.label}</small>
          </div>
        );
      })}
    </div>
  );
};

export const StatusBars = ({ rows }: { rows: StatusBreakdownItem[] }) => {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="status-bars" role="list" aria-label="Status breakdown">
      {rows.map((row) => (
        <div key={row.label} className="status-bars-row" role="listitem">
          <div className="status-bars-labels">
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
          <div className="status-bars-track">
            <span className={cn("status-bars-fill", `tone-${row.tone}`)} style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};
