import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Workout } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  getWorkoutsByDate: (date: string) => Workout[];
  getWorkoutsByWeek: (startDate: string) => Workout[];
  loadWorkouts: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: [],

  addWorkout: (workoutData) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    const updatedWorkouts = [...get().workouts, newWorkout];
    set({ workouts: updatedWorkouts });
    saveToStorage(STORAGE_KEYS.WORKOUTS, updatedWorkouts);
  },

  deleteWorkout: (id) => {
    const updatedWorkouts = get().workouts.filter(workout => workout.id !== id);
    set({ workouts: updatedWorkouts });
    saveToStorage(STORAGE_KEYS.WORKOUTS, updatedWorkouts);
  },

  updateWorkout: (id, updates) => {
    const updatedWorkouts = get().workouts.map(workout =>
      workout.id === id ? { ...workout, ...updates } : workout
    );
    set({ workouts: updatedWorkouts });
    saveToStorage(STORAGE_KEYS.WORKOUTS, updatedWorkouts);
  },

  getWorkoutsByDate: (date) => {
    return get().workouts.filter(workout => workout.date === date);
  },

  getWorkoutsByWeek: (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return get().workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= start && workoutDate <= end;
    });
  },

  loadWorkouts: () => {
    const storedWorkouts = loadFromStorage(STORAGE_KEYS.WORKOUTS);
    if (storedWorkouts) {
      set({ workouts: storedWorkouts });
    }
  },
}));