import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { id: 'workout', label: 'Workout', icon: '💪' },
  { id: 'stats', label: 'Body Stats', icon: '📈' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { theme, toggle } = useTheme();
  return (
    <nav 
      style={{ 
        background: 'var(--card-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '1px solid var(--card-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
  <div className="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 
                className="text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                💪 <span>FitTracker</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: activeTab === item.id ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)' : 'transparent',
                  color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: activeTab === item.id ? '0 4px 12px var(--primary-glow)' : 'none',
                  transform: activeTab === item.id ? 'translateY(-2px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.background = 'var(--btn-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
              })}
            </div>

            <button 
              onClick={toggle} 
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'var(--btn-secondary)',
                backdropFilter: 'var(--backdrop-blur)',
                border: '1px solid var(--card-border)',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'} {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};