import React, { useState, useEffect } from 'react';
import { MealForm } from '../components/MealForm';
import { MealList } from '../components/MealList';
import { GoalsForm } from '../components/GoalsForm';
import { NutritionCharts } from '../components/NutritionCharts';
import { useMealStore } from '../store/mealStore';
import { useGoalsStore } from '../store/goalsStore';
import type { Meal } from '../types';

export const Nutrition: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMealForm, setShowMealForm] = useState(false);
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const { loadMeals } = useMealStore();
  const { goals, loadGoals } = useGoalsStore();

  useEffect(() => {
    loadMeals();
    loadGoals();
  }, [loadMeals, loadGoals]);

  const todayMacros = useMealStore.getState().meals
    .filter(meal => meal.date === selectedDate)
    .reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  const calorieProgress = (todayMacros.calories / goals.dailyCalories) * 100;
  const proteinProgress = (todayMacros.protein / goals.dailyProtein) * 100;
  const carbsProgress = (todayMacros.carbs / goals.dailyCarbs) * 100;
  const fatProgress = (todayMacros.fat / goals.dailyFat) * 100;

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };

  const handleCloseMealForm = () => {
    setShowMealForm(false);
    setEditingMeal(null);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracker</h1>
        <p className="text-gray-600 mt-2">Log your meals and track your daily nutrition intake</p>
      </div>

      {/* Date Selector and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          {!isToday && (
            <div className="flex items-end">
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="btn-secondary text-sm"
              >
                Back to Today
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowGoalsForm(true)}
            className="btn-secondary"
          >
            ⚙️ Set Goals
          </button>
          <button
            onClick={() => setShowMealForm(true)}
            className="btn-primary"
          >
            ➕ Add Meal
          </button>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-600">{todayMacros.calories}</div>
          <div className="text-sm text-gray-600">/ {goals.dailyCalories} cal</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(calorieProgress)}% of goal
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl mb-2">🥩</div>
          <div className="text-2xl font-bold text-green-600">{todayMacros.protein.toFixed(1)}g</div>
          <div className="text-sm text-gray-600">/ {goals.dailyProtein}g</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(proteinProgress)}% of goal
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl mb-2">�</div>
          <div className="text-2xl font-bold text-blue-600">{todayMacros.carbs.toFixed(1)}g</div>
          <div className="text-sm text-gray-600">/ {goals.dailyCarbs}g</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(carbsProgress)}% of goal
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl mb-2">🥑</div>
          <div className="text-2xl font-bold text-purple-600">{todayMacros.fat.toFixed(1)}g</div>
          <div className="text-sm text-gray-600">/ {goals.dailyFat}g</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(fatProgress)}% of goal
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress</h3>
        
        <div className="space-y-4">
          {/* Calories */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Calories</span>
              <span>{todayMacros.calories} / {goals.dailyCalories}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Protein */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Protein</span>
              <span>{todayMacros.protein.toFixed(1)}g / {goals.dailyProtein}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Carbs */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Carbs</span>
              <span>{todayMacros.carbs.toFixed(1)}g / {goals.dailyCarbs}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(carbsProgress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Fat */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Fat</span>
              <span>{todayMacros.fat.toFixed(1)}g / {goals.dailyFat}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(fatProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal List */}
      <MealList 
        date={selectedDate} 
        onEditMeal={handleEditMeal}
      />

      {/* Modal Overlays */}
      {showMealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <MealForm 
              onClose={handleCloseMealForm}
              editMeal={editingMeal ? {
                id: editingMeal.id,
                foodName: editingMeal.foodName,
                calories: editingMeal.calories,
                protein: editingMeal.protein,
                carbs: editingMeal.carbs,
                fat: editingMeal.fat,
                type: editingMeal.type,
              } : undefined}
            />
          </div>
        </div>
      )}

      {showGoalsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <GoalsForm onClose={() => setShowGoalsForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};