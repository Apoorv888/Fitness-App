import React, { useState } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import type { Exercise, Workout } from '../types';
import { WORKOUT_TYPES } from '../utils/constants';

interface WorkoutFormProps {
  onClose?: () => void;
  editWorkout?: Omit<Workout, 'createdAt'> & { createdAt?: Date } | null;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onClose, editWorkout = null }) => {
  const { addWorkout, updateWorkout } = useWorkoutStore();

  const [form, setForm] = useState(() => ({
    date: editWorkout?.date || new Date().toISOString().split('T')[0],
    type: editWorkout?.type || (WORKOUT_TYPES[0] as typeof WORKOUT_TYPES[number]),
    duration: editWorkout?.duration || 0,
    notes: editWorkout?.notes || '',
    exercises: (editWorkout?.exercises || []) as Exercise[],
  }));

  const [exerciseDraft, setExerciseDraft] = useState<Partial<Exercise>>({ name: '', sets: 3, reps: 8, weight: undefined });

  const addExercise = () => {
    if (!exerciseDraft.name) return;
    const ex: Exercise = {
      id: Date.now().toString(),
      name: exerciseDraft.name as string,
      sets: Number(exerciseDraft.sets) || 0,
      reps: Number(exerciseDraft.reps) || 0,
      weight: exerciseDraft.weight ? Number(exerciseDraft.weight) : undefined,
      notes: exerciseDraft.notes,
    };

    setForm(prev => ({ ...prev, exercises: [...prev.exercises, ex] }));
    setExerciseDraft({ name: '', sets: 3, reps: 8, weight: undefined });
  };

  const removeExercise = (id: string) => {
    setForm(prev => ({ ...prev, exercises: prev.exercises.filter(e => e.id !== id) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      date: form.date,
      type: form.type,
      exercises: form.exercises,
      duration: form.duration,
      notes: form.notes,
    };

    if (editWorkout && 'id' in editWorkout) {
      updateWorkout(editWorkout.id, payload);
    } else {
      addWorkout(payload);
    }

    if (onClose) onClose();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{editWorkout ? 'Edit Workout' : 'Add Workout'}</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-500">✕</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="input-field">
            {WORKOUT_TYPES.map(wt => (
              <option key={wt} value={wt}>{wt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Duration (min)</label>
          <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="input-field" min={0} />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Notes</label>
          <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field" />
        </div>

        <div className="pt-2">
          <h4 className="font-medium mb-2">Exercises</h4>

          <div className="space-y-2">
            {form.exercises.map(ex => (
              <div key={ex.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div>
                  <div className="font-medium">{ex.name}</div>
                  <div className="text-sm text-gray-600">{ex.sets} x {ex.reps} {ex.weight ? `@ ${ex.weight}kg` : ''}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={() => removeExercise(ex.id)} className="text-red-600">Delete</button>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input placeholder="Exercise name" className="input-field" value={exerciseDraft.name || ''} onChange={e => setExerciseDraft(prev => ({ ...prev, name: e.target.value }))} />
              <input placeholder="Sets" type="number" className="input-field" value={String(exerciseDraft.sets || '')} onChange={e => setExerciseDraft(prev => ({ ...prev, sets: Number(e.target.value) }))} />
              <input placeholder="Reps" type="number" className="input-field" value={String(exerciseDraft.reps || '')} onChange={e => setExerciseDraft(prev => ({ ...prev, reps: Number(e.target.value) }))} />
              <input placeholder="Weight (kg)" type="number" className="input-field" value={exerciseDraft.weight ?? ''} onChange={e => setExerciseDraft(prev => ({ ...prev, weight: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>

            <div>
              <button type="button" onClick={addExercise} className="btn-secondary mt-2">Add Exercise</button>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <button type="submit" className="btn-primary flex-1">{editWorkout ? 'Update Workout' : 'Save Workout'}</button>
          {onClose && <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>}
        </div>
      </form>
    </div>
  );
};
