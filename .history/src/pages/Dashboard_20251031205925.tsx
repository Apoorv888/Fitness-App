import React, { useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { useMealStore } from '../store/mealStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useBodyStatsStore } from '../store/bodyStatsStore';
import { useGoalsStore } from '../store/goalsStore';
import { getWeekDays } from '../utils/helpers';
import { WorkoutHeatmap } from '../components/WorkoutHeatmap';
import { ExportImport } from '../components/ExportImport';
import { ExportCSV } from '../components/ExportCSV';

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
        <h1 
          className="text-3xl font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2" style={{ color: 'var(--text-secondary)' }}>Track your fitness journey</p>
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
        <div 
          className="card cursor-pointer" 
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.3))' }}>🍎</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Log Meal</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track your nutrition intake</p>
        </div>
        
        <div 
          className="card cursor-pointer" 
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))' }}>🏋️‍♂️</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Log Workout</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Record your training session</p>
        </div>
        
        <div 
          className="card cursor-pointer" 
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' }}>📊</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Update Stats</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Record body measurements</p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Today's Progress</h3>
        
        <div className="space-y-4">
          {/* Calories Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: '500' }}>Calories</span>
              <span>{todayMacros.calories} / {goals.dailyCalories}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
                  width: `${Math.min(calorieProgress, 100)}%`,
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 12px rgba(249, 115, 22, 0.5)'
                }}
              ></div>
            </div>
          </div>
          
          {/* Protein Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: '500' }}>Protein</span>
              <span>{todayMacros.protein}g / {goals.dailyProtein}g</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  width: `${Math.min(proteinProgress, 100)}%`,
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)'
                }}
              ></div>
            </div>
          </div>
          
          {/* Carbs Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: '500' }}>Carbs</span>
              <span>{todayMacros.carbs}g / {goals.dailyCarbs}g</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                  width: `${Math.min((todayMacros.carbs / goals.dailyCarbs) * 100, 100)}%`,
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
                }}
              ></div>
            </div>
          </div>
          
          {/* Fat Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: '500' }}>Fat</span>
              <span>{todayMacros.fat}g / {goals.dailyFat}g</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
                  width: `${Math.min((todayMacros.fat / goals.dailyFat) * 100, 100)}%`,
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 12px rgba(168, 85, 247, 0.5)'
                }}
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
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Last 7 days summary</h3>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Calories: <span className="font-semibold">{weekCalories}</span></div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Workouts: <span className="font-semibold">{weekWorkouts}</span></div>
          </div>

          <ExportImport />
          <div className="mt-4">
            <ExportCSV />
          </div>
        </div>
      </div>
    </div>
  );
};