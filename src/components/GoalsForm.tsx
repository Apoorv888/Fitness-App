import React, { useState } from 'react';
import { useGoalsStore } from '../store/goalsStore';

interface GoalsFormProps {
  onClose?: () => void;
}

export const GoalsForm: React.FC<GoalsFormProps> = ({ onClose }) => {
  const { goals, updateGoals } = useGoalsStore();
  
  const [formData, setFormData] = useState({
    dailyCalories: goals.dailyCalories,
    dailyProtein: goals.dailyProtein,
    dailyCarbs: goals.dailyCarbs,
    dailyFat: goals.dailyFat,
    goal: goals.goal,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoals(formData);
    if (onClose) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'goal' ? value : parseFloat(value) || 0
    }));
  };

  const calculateMacroCalories = () => {
    const proteinCals = formData.dailyProtein * 4;
    const carbsCals = formData.dailyCarbs * 4;
    const fatCals = formData.dailyFat * 9;
    return proteinCals + carbsCals + fatCals;
  };

  const macroCalories = calculateMacroCalories();
  const isCaloriesMatch = Math.abs(macroCalories - formData.dailyCalories) < 50;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Daily Nutrition Goals</h2>
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
        {/* Goal Type */}
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            Primary Goal
          </label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Weight</option>
          </select>
        </div>

        {/* Daily Calories */}
        <div>
          <label htmlFor="dailyCalories" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Calories Target
          </label>
          <input
            type="number"
            id="dailyCalories"
            name="dailyCalories"
            value={formData.dailyCalories}
            onChange={handleInputChange}
            className="input-field"
            min="1000"
            max="5000"
            step="10"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 1500-2500 calories per day
          </p>
        </div>

        {/* Macronutrient Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Macronutrient Targets</h3>
          
          <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
            {/* Protein */}
            <div>
              <label htmlFor="dailyProtein" className="block text-sm font-medium text-gray-700 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                id="dailyProtein"
                name="dailyProtein"
                value={formData.dailyProtein}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                step="1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.dailyProtein * 4)} calories ({((formData.dailyProtein * 4 / formData.dailyCalories) * 100).toFixed(0)}%)
              </p>
            </div>

            {/* Carbs */}
            <div>
              <label htmlFor="dailyCarbs" className="block text-sm font-medium text-gray-700 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                id="dailyCarbs"
                name="dailyCarbs"
                value={formData.dailyCarbs}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                step="1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.dailyCarbs * 4)} calories ({((formData.dailyCarbs * 4 / formData.dailyCalories) * 100).toFixed(0)}%)
              </p>
            </div>

            {/* Fat */}
            <div>
              <label htmlFor="dailyFat" className="block text-sm font-medium text-gray-700 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                id="dailyFat"
                name="dailyFat"
                value={formData.dailyFat}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                step="1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.dailyFat * 9)} calories ({((formData.dailyFat * 9 / formData.dailyCalories) * 100).toFixed(0)}%)
              </p>
            </div>
          </div>

          {/* Macro Validation */}
          <div className={`p-3 rounded-lg ${isCaloriesMatch ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {isCaloriesMatch ? '✅' : '⚠️'}
              </span>
              <div>
                <p className="text-sm font-medium">
                  Macro calories: {macroCalories} cal | Target: {formData.dailyCalories} cal
                </p>
                <p className="text-xs text-gray-600">
                  {isCaloriesMatch 
                    ? 'Your macros align well with your calorie target!' 
                    : `Difference: ${Math.abs(macroCalories - formData.dailyCalories)} calories`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Quick Presets:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                dailyProtein: Math.round(prev.dailyCalories * 0.30 / 4),
                dailyCarbs: Math.round(prev.dailyCalories * 0.40 / 4),
                dailyFat: Math.round(prev.dailyCalories * 0.30 / 9),
              }))}
              className="btn-secondary text-sm"
            >
              Balanced (30/40/30)
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                dailyProtein: Math.round(prev.dailyCalories * 0.40 / 4),
                dailyCarbs: Math.round(prev.dailyCalories * 0.30 / 4),
                dailyFat: Math.round(prev.dailyCalories * 0.30 / 9),
              }))}
              className="btn-secondary text-sm"
            >
              High Protein (40/30/30)
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                dailyProtein: Math.round(prev.dailyCalories * 0.25 / 4),
                dailyCarbs: Math.round(prev.dailyCalories * 0.50 / 4),
                dailyFat: Math.round(prev.dailyCalories * 0.25 / 9),
              }))}
              className="btn-secondary text-sm"
            >
              High Carb (25/50/25)
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            Save Goals
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