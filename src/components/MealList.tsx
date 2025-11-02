import React from 'react';
import { useMealStore } from '../store/mealStore';
import type { Meal } from '../types';

interface MealListProps {
  date: string;
  onEditMeal?: (meal: Meal) => void;
}

export const MealList: React.FC<MealListProps> = ({ date, onEditMeal }) => {
  const { getMealsByDate, deleteMeal } = useMealStore();
  const meals = getMealsByDate(date);

  const mealsByType = meals.reduce((acc, meal) => {
    if (!acc[meal.type]) {
      acc[meal.type] = [];
    }
    acc[meal.type].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  const handleDelete = (mealId: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      deleteMeal(mealId);
    }
  };

  if (meals.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-4xl mb-4">🍽️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No meals logged yet</h3>
        <p className="text-gray-600">Start tracking your nutrition by adding your first meal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(mealsByType).map(([mealType, typeMeals]) => (
        <div key={mealType} className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">
              {mealType === 'Breakfast' && '🌅'}
              {mealType === 'Lunch' && '☀️'}
              {mealType === 'Dinner' && '🌙'}
              {mealType === 'Snack' && '🍎'}
            </span>
            {mealType}
          </h3>
          
          <div className="space-y-3">
            {typeMeals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{meal.foodName}</h4>
                  <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                    <span>{meal.calories} cal</span>
                    <span>{meal.protein}g protein</span>
                    <span>{meal.carbs}g carbs</span>
                    <span>{meal.fat}g fat</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {onEditMeal && (
                    <button
                      onClick={() => onEditMeal(meal)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Meal Type Totals */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{mealType} Total:</span>
              <div className="flex space-x-4">
                <span>{typeMeals.reduce((sum, meal) => sum + meal.calories, 0)} cal</span>
                <span>{typeMeals.reduce((sum, meal) => sum + meal.protein, 0).toFixed(1)}g protein</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};