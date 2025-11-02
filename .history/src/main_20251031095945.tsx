import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useMealStore } from './store/mealStore'
import { useWorkoutStore } from './store/workoutStore'
import { useBodyStatsStore } from './store/bodyStatsStore'
import { useGoalsStore } from './store/goalsStore'

function Boot() {
  const { loadMeals } = useMealStore();
  const { loadWorkouts } = useWorkoutStore();
  const { loadBodyStats } = useBodyStatsStore();
  const { loadGoals } = useGoalsStore();

  useEffect(() => {
    loadMeals();
    loadWorkouts();
    loadBodyStats();
    loadGoals();
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Boot />
  </StrictMode>,
)
