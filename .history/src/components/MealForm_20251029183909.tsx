import React, { useState } from 'react';
import { useMealStore } from '../store/mealStore';
import { MEAL_TYPES } from '../utils/constants';
import type { MealType } from '../utils/constants';

interface MealFormProps {
  onClose?: () => void;
  editMeal?: {
    id: string;
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    type: MealType;
  };
}

export const MealForm: React.FC<MealFormProps> = ({ onClose, editMeal }) => {
  const { addMeal, updateMeal } = useMealStore();
  
  const [formData, setFormData] = useState({
    foodName: editMeal?.foodName || '',
    calories: editMeal?.calories || 0,
    protein: editMeal?.protein || 0,
    carbs: editMeal?.carbs || 0,
    fat: editMeal?.fat || 0,
    type: editMeal?.type || 'Breakfast' as MealType,
    date: new Date().toISOString().split('T')[0], // Today's date
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required';
    }
    
    if (formData.calories <= 0) {
      newErrors.calories = 'Calories must be greater than 0';
    }
    
    if (formData.protein < 0) {
      newErrors.protein = 'Protein cannot be negative';
    }
    
    if (formData.carbs < 0) {
      newErrors.carbs = 'Carbs cannot be negative';
    }
    
    if (formData.fat < 0) {
      newErrors.fat = 'Fat cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editMeal) {
      updateMeal(editMeal.id, {
        foodName: formData.foodName,
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
        type: formData.type,
        date: formData.date,
      });
    } else {
      addMeal({
        foodName: formData.foodName,
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
        type: formData.type,
        date: formData.date,
      });
    }

    // Reset form
    setFormData({
      foodName: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      type: 'Breakfast',
      date: new Date().toISOString().split('T')[0],
    });

    if (onClose) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'foodName' || name === 'type' || name === 'date' 
        ? value 
        : parseFloat(value) || 0
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {editMeal ? 'Edit Meal' : 'Add New Meal'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Meal Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            {MEAL_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Food Name */}
        <div>
          <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
            Food Name
          </label>
          <input
            type="text"
            id="foodName"
            name="foodName"
            value={formData.foodName}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., Chicken breast, Rice, Apple"
            required
          />
          {errors.foodName && (
            <p className="text-sm text-red-600 mt-1">{errors.foodName}</p>
          )}
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calories */}
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
              Calories
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleInputChange}
              className="input-field"
              min="0"
              step="1"
              required
            />
            {errors.calories && (
              <p className="text-sm text-red-600 mt-1">{errors.calories}</p>
            )}
          </div>

          {/* Protein */}
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleInputChange}
              className="input-field"
              min="0"
              step="0.1"
            />
            {errors.protein && (
              <p className="text-sm text-red-600 mt-1">{errors.protein}</p>
            )}
          </div>

          {/* Carbs */}
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleInputChange}
              className="input-field"
              min="0"
              step="0.1"
            />
            {errors.carbs && (
              <p className="text-sm text-red-600 mt-1">{errors.carbs}</p>
            )}
          </div>

          {/* Fat */}
          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat}
              onChange={handleInputChange}
              className="input-field"
              min="0"
              step="0.1"
            />
            {errors.fat && (
              <p className="text-sm text-red-600 mt-1">{errors.fat}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            {editMeal ? 'Update Meal' : 'Add Meal'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};