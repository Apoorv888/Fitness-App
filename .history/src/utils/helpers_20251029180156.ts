// Date utilities
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';

export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
export const formatDisplayDate = (date: Date) => format(date, 'MMM dd, yyyy');
export const formatTime = (date: Date) => format(date, 'HH:mm');

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const isTodayDate = (date: Date) => isToday(date);

// Calculate BMI
export const calculateBMI = (weight: number, height: number) => {
  return (weight / (height * height)) * 10000; // height in cm
};

// Calculate calories needed for goal
export const calculateCalorieGoal = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: number,
  goal: 'lose' | 'maintain' | 'gain'
) => {
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  const tdee = bmr * activityLevel;
  
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500); // 1 lb per week
    case 'gain':
      return Math.round(tdee + 500); // 1 lb per week
    default:
      return Math.round(tdee);
  }
};

// Format numbers
export const formatNumber = (num: number, decimals: number = 1) => {
  return Number(num.toFixed(decimals));
};

// Local storage helpers
export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromStorage = (key: string) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};