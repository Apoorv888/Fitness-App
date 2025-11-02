import { create } from 'zustand';
import type { UserGoals } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

interface UserGoalsStore {
  goals: UserGoals;
  updateGoals: (updates: Partial<UserGoals>) => void;
  loadGoals: () => void;
}

const defaultGoals: UserGoals = {
  dailyCalories: 2000,
  dailyProtein: 150,
  dailyCarbs: 200,
  dailyFat: 65,
  activityLevel: 1.375, // Lightly active
  goal: 'maintain',
};

export const useGoalsStore = create<UserGoalsStore>((set, get) => ({
  goals: defaultGoals,

  updateGoals: (updates) => {
    const updatedGoals = { ...get().goals, ...updates };
    set({ goals: updatedGoals });
    saveToStorage(STORAGE_KEYS.USER_GOALS, updatedGoals);
  },

  loadGoals: () => {
    const storedGoals = loadFromStorage(STORAGE_KEYS.USER_GOALS);
    if (storedGoals) {
      set({ goals: { ...defaultGoals, ...storedGoals } });
    }
  },
}));