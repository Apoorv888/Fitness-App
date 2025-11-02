import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  subtitle,
  color = 'blue'
}) => {
  const trendIcons = {
    up: '↗️',
    down: '↘️',
    stable: '➡️',
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
            )}
          </div>
        </div>
        
        {trend && (
          <div className="text-lg">
            {trendIcons[trend]}
          </div>
        )}
      </div>
    </div>
  );
};