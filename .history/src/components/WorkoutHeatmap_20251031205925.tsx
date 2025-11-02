import React, { useMemo } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { formatDate, formatDisplayDate } from '../utils/helpers';

interface DayCell {
  date: Date;
  count: number;
}

const COLORS = [
  'rgba(148, 163, 184, 0.1)', 
  'rgba(129, 140, 248, 0.3)', 
  'rgba(129, 140, 248, 0.6)', 
  'rgba(99, 102, 241, 0.8)', 
  'rgba(79, 70, 229, 1)'
];

export const WorkoutHeatmap: React.FC<{ days?: number }> = ({ days = 90 }) => {
  const { workouts } = useWorkoutStore();

  const cells: DayCell[] = useMemo(() => {
    const result: DayCell[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = formatDate(d);
      const count = workouts.filter(w => w.date === dateKey).length;
      result.push({ date: d, count });
    }
    return result;
  }, [workouts, days]);

  // Arrange into weeks (columns of 7 days)
  const weeks: DayCell[][] = useMemo(() => {
    const cols: DayCell[][] = [];
    let week: DayCell[] = [];
    // Start from the first day in cells and group by weekday (Sun..Sat)
    for (const cell of cells) {
      week.push(cell);
      if (week.length === 7) {
        cols.push(week);
        week = [];
      }
    }
    if (week.length > 0) cols.push(week);
    return cols;
  }, [cells]);

  const colorFor = (count: number) => {
    if (count === 0) return COLORS[0];
    if (count === 1) return COLORS[1];
    if (count <= 2) return COLORS[2];
    if (count <= 4) return COLORS[3];
    return COLORS[4];
  };

  const handleClick = (date: Date) => {
    const ev = new CustomEvent('open-workout-date', { detail: { date: formatDate(date) } });
    window.dispatchEvent(ev);
    // Also request navigation to workout page
    const nav = new CustomEvent('request-nav', { detail: { tab: 'workout' } });
    window.dispatchEvent(nav);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
        Workout Streak <span style={{ color: 'var(--muted)', fontSize: '14px' }}>(last {days} days)</span>
      </h3>
      <div className="overflow-x-auto">
        <div className="flex items-start" style={{ gap: 6 }}>
          {weeks.map((week, ci) => (
            <div key={ci} className="flex flex-col" style={{ gap: 6 }}>
              {Array.from({ length: 7 }).map((_, ri) => {
                const cell = week[ri];
                if (!cell) {
                  return <div key={ri} style={{ width: 14, height: 14 }} />;
                }
                const title = `${formatDisplayDate(cell.date)} — ${cell.count} workout${cell.count === 1 ? '' : 's'}`;
                return (
                  <div
                    key={ri}
                    title={title}
                    onClick={() => handleClick(cell.date)}
                    style={{
                      width: 14,
                      height: 14,
                      background: colorFor(cell.count),
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: cell.count > 0 ? '0 0 8px rgba(99, 102, 241, 0.4)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      e.currentTarget.style.zIndex = '10';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.zIndex = '1';
                    }}
                    className="transition-shadow"
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs mt-3" style={{ color: 'var(--muted)' }}>Click a day to view workouts for that date.</div>
    </div>
  );
};
