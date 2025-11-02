import React, { useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { useMealStore } from '../store/mealStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useBodyStatsStore } from '../store/bodyStatsStore';
import { useGoalsStore } from '../store/goalsStore';
import { getWeekDays } from '../utils/helpers';
import { WorkoutHeatmap } from '../components/WorkoutHeatmap';
import { ExportImport } from '../components/ExportImport';

export const Dashboard: React.FC = () => {
  const { getTodayMacros, loadMeals } = useMealStore();
  const { workouts, loadWorkouts } = useWorkoutStore();
  const { getLatestWeight, getWeightTrend, loadBodyStats } = useBodyStatsStore();
  const { goals, loadGoals } = useGoalsStore();

  useEffect(() => {
    loadMeals();
    loadWorkouts();
    loadBodyStats();
    loadGoals();
  }, [loadMeals, loadWorkouts, loadBodyStats, loadGoals]);

  const todayMacros = getTodayMacros();
  const currentWeight = getLatestWeight();
  const weightTrend = getWeightTrend();
  
  // Calculate this week's workouts
  const today = new Date();
  const weekDays = getWeekDays(today);
  const weekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= weekDays[0] && workoutDate <= weekDays[6];
  }).length;

  // Weekly aggregates (last 7 days)
  const mealsForWeek = useMealStore.getState().meals.filter(m => {
    const d = new Date(m.date);
    return d >= weekDays[0] && d <= weekDays[6];
  });
  const weekCalories = mealsForWeek.reduce((s, m) => s + (m.calories || 0), 0);

  const calorieProgress = Math.round((todayMacros.calories / goals.dailyCalories) * 100);
  const proteinProgress = Math.round((todayMacros.protein / goals.dailyProtein) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your fitness journey</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Calories"
          value={todayMacros.calories}
          unit={`/ ${goals.dailyCalories}`}
          icon="🔥"
          subtitle={`${calorieProgress}% of goal`}
          color="orange"
        />
        
        <StatCard
          title="Protein Today"
          value={todayMacros.protein}
          unit={`g / ${goals.dailyProtein}g`}
          icon="🥩"
          subtitle={`${proteinProgress}% of goal`}
          color="green"
        />
        
        <StatCard
          title="This Week's Workouts"
          value={weekWorkouts}
          unit="sessions"
          icon="💪"
          subtitle="Keep it up!"
          color="purple"
        />
        
        <StatCard
          title="Current Weight"
          value={currentWeight || '---'}
          unit="kg"
          icon="⚖️"
          trend={currentWeight ? weightTrend : undefined}
          subtitle="Latest measurement"
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-4xl mb-3">🍎</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Log Meal</h3>
            <p className="text-gray-600 text-sm">Track your nutrition intake</p>
          </div>
        </div>
        
        <div className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-4xl mb-3">🏋️‍♂️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Log Workout</h3>
            <p className="text-gray-600 text-sm">Record your training session</p>
          </div>
        </div>
        
        <div className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Stats</h3>
            <p className="text-gray-600 text-sm">Record body measurements</p>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
        
        <div className="space-y-4">
          {/* Calories Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Calories</span>
              <span>{todayMacros.calories} / {goals.dailyCalories}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Protein Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Protein</span>
              <span>{todayMacros.protein}g / {goals.dailyProtein}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Carbs Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Carbs</span>
              <span>{todayMacros.carbs}g / {goals.dailyCarbs}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((todayMacros.carbs / goals.dailyCarbs) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Fat Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Fat</span>
              <span>{todayMacros.fat}g / {goals.dailyFat}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((todayMacros.fat / goals.dailyFat) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkoutHeatmap days={90} />
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Last 7 days summary</h3>
            <div className="text-sm text-gray-600">Calories: <span className="font-semibold">{weekCalories}</span></div>
            <div className="text-sm text-gray-600">Workouts: <span className="font-semibold">{weekWorkouts}</span></div>
          </div>

          <ExportImport />
        </div>
      </div>
    </div>
  );
};