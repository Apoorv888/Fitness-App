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
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    stable: '➡️',
  };

  return (
    <div className={`card ${colorClasses[color]} border-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
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