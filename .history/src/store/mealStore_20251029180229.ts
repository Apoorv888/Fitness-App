import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Meal } from '../types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '../utils/helpers';

interface MealStore {
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => void;
  deleteMeal: (id: string) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  getMealsByDate: (date: string) => Meal[];
  getTodayMacros: () => { calories: number; protein: number; carbs: number; fat: number };
  loadMeals: () => void;
}

export const useMealStore = create<MealStore>((set, get) => ({
  meals: [],

  addMeal: (mealData) => {
    const newMeal: Meal = {
      ...mealData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    const updatedMeals = [...get().meals, newMeal];
    set({ meals: updatedMeals });
    saveToStorage(STORAGE_KEYS.MEALS, updatedMeals);
  },

  deleteMeal: (id) => {
    const updatedMeals = get().meals.filter(meal => meal.id !== id);
    set({ meals: updatedMeals });
    saveToStorage(STORAGE_KEYS.MEALS, updatedMeals);
  },

  updateMeal: (id, updates) => {
    const updatedMeals = get().meals.map(meal =>
      meal.id === id ? { ...meal, ...updates } : meal
    );
    set({ meals: updatedMeals });
    saveToStorage(STORAGE_KEYS.MEALS, updatedMeals);
  },

  getMealsByDate: (date) => {
    return get().meals.filter(meal => meal.date === date);
  },

  getTodayMacros: () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = get().getMealsByDate(today);
    
    return todayMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  },

  loadMeals: () => {
    const storedMeals = loadFromStorage(STORAGE_KEYS.MEALS);
    if (storedMeals) {
      set({ meals: storedMeals });
    }
  },
}));