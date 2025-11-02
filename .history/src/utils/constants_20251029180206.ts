// App constants
export const STORAGE_KEYS = {
  MEALS: 'fitness-app-meals',
  WORKOUTS: 'fitness-app-workouts',
  BODY_STATS: 'fitness-app-body-stats',
  USER_GOALS: 'fitness-app-user-goals',
} as const;

export const ACTIVITY_LEVELS = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTREMELY_ACTIVE: 1.9,
} as const;

export const WORKOUT_TYPES = [
  'Push',
  'Pull',
  'Legs',
  'Upper',
  'Lower',
  'Full Body',
  'Cardio',
  'Rest',
] as const;

export const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
] as const;

export const DEFAULT_MACRO_RATIOS = {
  protein: 0.3,
  carbs: 0.4,
  fat: 0.3,
} as const;

export const BODY_MEASUREMENT_TYPES = [
  'weight',
  'bodyFat',
  'muscle',
  'waist',
  'chest',
  'arms',
  'thighs',
] as const;

export type WorkoutType = typeof WORKOUT_TYPES[number];
export type MealType = typeof MEAL_TYPES[number];
export type BodyMeasurementType = typeof BODY_MEASUREMENT_TYPES[number];