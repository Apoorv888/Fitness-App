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

  // For dynamic reps & weights per set, store drafts as string arrays (blank by default)
  const [exerciseDraft, setExerciseDraft] = useState<{ name?: string; sets?: number; reps: string[]; weights: string[]; notes?: string }>({ name: '', sets: 3, reps: ['', '', ''], weights: ['', '', ''], notes: '' });

  const addExercise = () => {
    if (!exerciseDraft.name) return;
    const sets = Number(exerciseDraft.sets) || 0;
    // Convert reps/weights arrays to numbers, keep undefined for blanks
    const repsArr = (exerciseDraft.reps || []).map(r => r === '' ? undefined : Number(r));
    const weightsArr = (exerciseDraft.weights || []).map(w => w === '' ? undefined : Number(w));
    const ex = {
      id: Date.now().toString(),
      name: exerciseDraft.name as string,
      sets,
      reps: repsArr,
      weights: weightsArr,
      notes: exerciseDraft.notes,
    } as import('../types').Exercise;

    setForm(prev => ({ ...prev, exercises: [...prev.exercises, ex] }));
    setExerciseDraft({ name: '', sets: 3, reps: Array(3).fill(''), weights: Array(3).fill(''), notes: '' });
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
                  <div className="text-sm text-gray-600">
                    {ex.sets} sets x [
                    {Array.isArray(ex.reps) ? ex.reps.join(', ') : ex.reps}
                    ] reps
                      {ex.weights && Array.isArray(ex.weights) && ex.weights.some(w => w !== undefined) && (
                        <> {' '}@ [
                          {ex.weights.map(w => (w === undefined ? '-' : w)).join(', ')}kg]
                        </>
                      )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={() => removeExercise(ex.id)} className="text-red-600">Delete</button>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                placeholder="Exercise name"
                className="input-field"
                value={exerciseDraft.name || ''}
                onChange={e => setExerciseDraft(prev => ({ ...prev, name: e.target.value }))}
              />

              <input
                placeholder="Sets"
                type="number"
                className="input-field no-spinner"
                value={String(exerciseDraft.sets || '')}
                min={1}
                inputMode="numeric"
                onChange={e => {
                  const sets = Number(e.target.value) || 0;
                  // Adjust reps & weights array length
                  setExerciseDraft(prev => ({
                    ...prev,
                    sets,
                    reps: Array(sets).fill('').map((_, i) => (prev.reps && prev.reps[i]) || ''),
                    weights: Array(sets).fill('').map((_, i) => (prev.weights && prev.weights[i]) || ''),
                  }));
                }}
              />

              <div className="flex flex-col gap-1 md:col-span-2">
                <div className="flex gap-2 mb-1">
                  <span className="text-xs text-gray-500 flex-1 text-center">Reps per set</span>
                  <span className="text-xs text-gray-500 flex-1 text-center">Weight per set (kg)</span>
                </div>

                <div className="flex gap-2">
                  <div className="flex gap-1 flex-1">
                    {(exerciseDraft.reps || []).map((rep, idx) => (
                      <input
                        key={`rep-${idx}`}
                        type="number"
                        className="input-field no-spinner w-14"
                        placeholder={`Set ${idx + 1}`}
                        value={rep}
                        inputMode="numeric"
                        min={0}
                        onChange={e => {
                          const val = e.target.value;
                          setExerciseDraft(prev => ({
                            ...prev,
                            reps: (prev.reps || []).map((r, i) => i === idx ? val : r),
                          }));
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex gap-1 flex-1">
                    {(exerciseDraft.weights || []).map((weight, idx) => (
                      <input
                        key={`w-${idx}`}
                        type="number"
                        className="input-field no-spinner w-14"
                        placeholder={`Set ${idx + 1}`}
                        value={weight}
                        inputMode="numeric"
                        min={0}
                        onChange={e => {
                          const val = e.target.value;
                          setExerciseDraft(prev => ({
                            ...prev,
                            weights: (prev.weights || []).map((w, i) => i === idx ? val : w),
                          }));
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
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
