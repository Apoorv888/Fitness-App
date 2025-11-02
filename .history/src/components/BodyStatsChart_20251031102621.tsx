import React, { useMemo } from 'react';
import { useBodyStatsStore } from '../store/bodyStatsStore';
import { formatDisplayDate } from '../utils/helpers';

export const BodyStatsChart: React.FC = () => {
  const { bodyStats } = useBodyStatsStore();
  const data = useMemo(() => {
    return bodyStats
      .filter(s => s.weight !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(s => ({ date: s.date, weight: s.weight }));
  }, [bodyStats]);

  if (data.length < 2) {
    return <div className="card">Add at least two weight entries to see a trend chart.</div>;
  }

  // Simple SVG line chart
  const width = 600;
  const height = 160;
  const padding = 30;
  const values = data.map(d => d.weight ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + ((max - (d.weight ?? 0)) / (max - min || 1)) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Weight Trend</h3>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline fill="none" stroke="#4f46e5" strokeWidth={2} points={points} />
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - padding * 2);
          const y = padding + ((max - (d.weight ?? 0)) / (max - min || 1)) * (height - padding * 2);
          return (
            <g key={i}>
              <title>{`${formatDisplayDate(new Date(d.date))}: ${d.weight} kg`}</title>
              <circle cx={x} cy={y} r={3} fill="#4f46e5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
