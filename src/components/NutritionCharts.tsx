import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useMealStore } from '../store/mealStore';
import { useGoalsStore } from '../store/goalsStore';

interface NutritionChartsProps {
  selectedDate: string;
}

export const NutritionCharts: React.FC<NutritionChartsProps> = ({ selectedDate }) => {
  const { meals } = useMealStore();
  const { goals } = useGoalsStore();

  // Get last 7 days of data
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date(selectedDate);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = meals.filter(meal => meal.date === dateStr);
      const dayTotals = dayMeals.reduce(
        (totals, meal) => ({
          calories: totals.calories + meal.calories,
          protein: totals.protein + meal.protein,
          carbs: totals.carbs + meal.carbs,
          fat: totals.fat + meal.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      data.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        ...dayTotals,
        goal: goals.dailyCalories,
      });
    }
    
    return data;
  };

  // Get today's macro breakdown
  const getTodayMacroBreakdown = () => {
    const todayMeals = meals.filter(meal => meal.date === selectedDate);
    const totals = todayMeals.reduce(
      (totals, meal) => ({
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    return [
      { name: 'Protein', value: totals.protein * 4, color: '#22c55e', unit: 'g', amount: totals.protein },
      { name: 'Carbs', value: totals.carbs * 4, color: '#3b82f6', unit: 'g', amount: totals.carbs },
      { name: 'Fat', value: totals.fat * 9, color: '#a855f7', unit: 'g', amount: totals.fat },
    ];
  };

  // Get meal distribution for today
  const getMealDistribution = () => {
    const todayMeals = meals.filter(meal => meal.date === selectedDate);
    const mealTotals = todayMeals.reduce((acc, meal) => {
      acc[meal.type] = (acc[meal.type] || 0) + meal.calories;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(mealTotals).map(([type, calories]) => ({
      name: type,
      calories,
      color: type === 'Breakfast' ? '#f97316' : 
             type === 'Lunch' ? '#eab308' : 
             type === 'Dinner' ? '#6366f1' : '#ec4899'
    }));
  };

  const weekData = getLast7DaysData();
  const macroData = getTodayMacroBreakdown();
  const mealData = getMealDistribution();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value} {entry.dataKey === 'calories' ? 'cal' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Weekly Calorie Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Calorie Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="goal" 
              stroke="#d1d5db" 
              strokeDasharray="5 5"
              name="Goal"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke="#f97316" 
              strokeWidth={3}
              name="Calories"
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

  <div className="grid grid-cols-1 lg-grid-cols-2 gap-8">
        {/* Macro Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Macro Breakdown</h3>
          {macroData.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const item = macroData.find(d => d.name === name);
                    return [`${value} cal (${item?.amount}${item?.unit})`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No meals logged yet for today</p>
            </div>
          )}
          
          {/* Legend */}
          {macroData.some(item => item.value > 0) && (
            <div className="flex justify-center space-x-4 mt-4">
              {macroData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.amount}{item.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meal Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Meal Distribution</h3>
          {mealData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} cal`, 'Calories']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="calories">
                  {mealData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🍽️</div>
              <p>No meals logged yet for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};