import React from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import type { Workout } from '../types';

interface WorkoutListProps {
  date?: string;
  onEdit?: (w: Workout) => void;
}

export const WorkoutList: React.FC<WorkoutListProps> = ({ date, onEdit }) => {
  const { workouts, deleteWorkout } = useWorkoutStore();
  const items = date ? workouts.filter(w => w.date === date) : workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (items.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-5xl mb-4">🛌</div>
        <h3 className="text-lg font-medium text-gray-900">No workouts logged</h3>
        <p className="text-gray-600">Use the button to add your first workout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(w => (
        <div key={w.id} className="card flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">{w.type} • {w.date}</div>
            <div className="text-sm text-gray-600">{w.exercises.length} exercises • {w.duration ?? 0} min</div>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && <button onClick={() => onEdit(w)} className="text-blue-600">Edit</button>}
            <button onClick={() => { if (confirm('Delete workout?')) deleteWorkout(w.id); }} className="text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};
