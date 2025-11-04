// Type definitions for the fitness app
export interface Meal {
  id: string;
  date: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | number[];
  weight?: number;
  duration?: number; // for cardio
  notes?: string;
}

export interface Workout {
  id: string;
  date: string;
  type: 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'Full Body' | 'Cardio' | 'Rest';
  exercises: Exercise[];
  duration?: number; // in minutes
  notes?: string;
  createdAt: Date;
}

export interface BodyStat {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  muscle?: number;
  waist?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  photoPath?: string;
  createdAt: Date;
}

export interface UserGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  targetWeight?: number;
  activityLevel: number;
  goal: 'lose' | 'maintain' | 'gain';
}

export interface DashboardStats {
  todayCalories: number;
  todayMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  weeklyWorkouts: number;
  currentWeight?: number;
  weightTrend: 'up' | 'down' | 'stable';
}