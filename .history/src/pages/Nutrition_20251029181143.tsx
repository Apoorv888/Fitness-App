import React from 'react';

export const Nutrition: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracker</h1>
        <p className="text-gray-600 mt-2">Log your meals and track macronutrients</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍎</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nutrition Tracking</h3>
          <p className="text-gray-600">
            This section will allow you to log meals and track your daily nutrition intake.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Coming in Phase 2 of development
          </p>
        </div>
      </div>
    </div>
  );
};