import React from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface WorkoutChartProps {
  selectedDate?: string;
}

export const WorkoutChart: React.FC<WorkoutChartProps> = ({ selectedDate }) => {
  const { workouts } = useWorkoutStore();

  const today = selectedDate ? new Date(selectedDate) : new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = workouts.filter(w => w.date === dateStr).length;
    data.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), count, date: dateStr });
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Workout Streak</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis allowDecimals={false} stroke="#6b7280" />
          <Tooltip formatter={(val: number) => [`${val} sessions`, 'Workouts']} />
          <Bar dataKey="count" fill="#2563eb">
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.count > 0 ? '#2563eb' : '#e5e7eb'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
