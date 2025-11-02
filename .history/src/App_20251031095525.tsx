import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Nutrition } from './pages/Nutrition';
import { Workout } from './pages/Workout';
import { BodyStats } from './pages/BodyStats';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Listen for external navigation requests (CustomEvent 'request-nav')
  React.useEffect(() => {
    const handler = (e: any) => {
      const tab = e?.detail?.tab;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('request-nav', handler as EventListener);
    return () => window.removeEventListener('request-nav', handler as EventListener);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'nutrition':
        return <Nutrition />;
      case 'workout':
        return <Workout />;
      case 'stats':
        return <BodyStats />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;
