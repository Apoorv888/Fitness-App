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

const colorGradients = {
  blue: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  orange: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  purple: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
};

const colorGlows = {
  blue: 'rgba(59, 130, 246, 0.2)',
  green: 'rgba(16, 185, 129, 0.2)',
  orange: 'rgba(249, 115, 22, 0.2)',
  purple: 'rgba(168, 85, 247, 0.2)',
};

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
    <div 
      className="card" 
      style={{ 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated gradient background */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colorGradients[color],
          opacity: 0.05,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Icon with glow effect */}
      <div 
        style={{
          fontSize: '48px',
          marginBottom: '12px',
          display: 'inline-block',
          filter: `drop-shadow(0 4px 8px ${colorGlows[color]})`,
          animation: 'pulse 3s ease-in-out infinite'
        }}
      >
        {icon}
      </div>

      <h3 
        className="text-sm font-medium mb-2" 
        style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}
      >
        {title}
      </h3>
      
      <div className="flex items-baseline space-x-2 mb-2">
        <span 
          className="text-4xl font-bold" 
          style={{ 
            background: colorGradients[color],
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {unit}
          </span>
        )}
        {trend && (
          <span className="text-xl ml-auto">
            {trendIcons[trend]}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};