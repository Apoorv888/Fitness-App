import React from 'react';

export const Workout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workout Log</h1>
        <p className="text-gray-600 mt-2">Track your training sessions and progress</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💪</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Workout Tracking</h3>
          <p className="text-gray-600">
            This section will allow you to log workouts and track your training consistency.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Coming in Phase 3 of development
          </p>
        </div>
      </div>
    </div>
  );
};