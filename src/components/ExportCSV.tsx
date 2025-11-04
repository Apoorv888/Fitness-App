import React from 'react';
import { useMealStore } from '../store/mealStore';
import { useWorkoutStore } from '../store/workoutStore';

const toCSV = (rows: any[], headers?: string[]) => {
  if (rows.length === 0) return '';
  const keys = headers ?? Object.keys(rows[0]);
  const lines = [keys.join(',')];
  for (const r of rows) {
    lines.push(keys.map(k => {
      const v = r[k] ?? '';
      if (typeof v === 'string') return `"${v.replace(/"/g, '""')}"`;
      return v;
    }).join(','));
  }
  return lines.join('\n');
};

export const ExportCSV: React.FC = () => {
  const meals = useMealStore((s) => s.meals);
  const workouts = useWorkoutStore((s) => s.workouts);

  const exportMeals = () => {
    const rows = meals.map(m => ({ date: m.date, type: m.type, foodName: m.foodName, calories: m.calories, protein: m.protein, carbs: m.carbs, fat: m.fat }));
    const csv = toCSV(rows, ['date','type','foodName','calories','protein','carbs','fat']);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `meals-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const exportWorkouts = () => {
    const rows = workouts.map(w => ({
      date: w.date,
      type: w.type,
      duration: w.duration ?? '',
      exercises: w.exercises.map(e => {
        const reps = Array.isArray(e.reps) ? e.reps.map(r => r === undefined ? '-' : r).join('/') : (e.reps ?? '');
  const weights = Array.isArray((e as any).weights) ? (e as any).weights.map((wt: any) => wt === undefined ? '-' : wt).join('/') : '';
        return `${e.name}(${e.sets}x${reps}${weights ? ' @' + weights + 'kg' : ''})`;
      }).join('|'),
      notes: w.notes ?? ''
    }));
    const csv = toCSV(rows, ['date','type','duration','exercises','notes']);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `workouts-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Export CSV</h3>
      <div className="flex space-x-2">
        <button onClick={exportMeals} className="btn-primary">Export Meals CSV</button>
        <button onClick={exportWorkouts} className="btn-secondary">Export Workouts CSV</button>
      </div>
      <p className="text-sm text-gray-500 mt-2">CSV includes basic fields; exercises are joined with '|' and sets shown in parentheses.</p>
    </div>
  );
};
