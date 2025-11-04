import React, { useState, useEffect } from 'react';
import { WorkoutForm } from '../components/WorkoutForm';
import { WorkoutList } from '../components/WorkoutList';
import { WorkoutChart } from '../components/WorkoutChart';
import { useWorkoutStore } from '../store/workoutStore';

export const Workout: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const { loadWorkouts } = useWorkoutStore();

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  useEffect(() => {
    const handler = (e: any) => {
      const d = e?.detail?.date as string | undefined;
      if (d) {
        setSelectedDate(d);
        setShowForm(false);
      }
    };
    window.addEventListener('open-workout-date', handler as EventListener);
    return () => window.removeEventListener('open-workout-date', handler as EventListener);
  }, []);

  return (
  <div className="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Log</h1>
          <p className="text-gray-600 mt-2">Track your training sessions and progress</p>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">➕ Add Workout</button>
        </div>
      </div>

  <div className="grid grid-cols-1 lg-grid-cols-3 gap-6">
  <div className="lg-col-span-2">
          <WorkoutList date={selectedDate} onEdit={(w) => { setEditing(w); setShowForm(true); }} />
        </div>

        <div>
          <WorkoutChart />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <WorkoutForm onClose={() => setShowForm(false)} editWorkout={editing} />
          </div>
        </div>
      )}
    </div>
  );
};