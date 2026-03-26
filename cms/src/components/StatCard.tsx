import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  change?: number;
  subtitle?: string;
}

const colorMap = {
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#a855f7',
  orange: '#f97316',
  red: '#ef4444',
};

export default function StatCard({ title, value, icon, color, change, subtitle }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="stat-card" style={{ '--stat-color': c } as any}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <div className="stat-card__title">{title}</div>
        <div className="stat-card__value">{value}</div>
        {(subtitle || change !== undefined) && (
          <div className="stat-card__sub">
            {change !== undefined && (
              <>
                {change >= 0
                  ? <TrendingUp size={12} style={{ color: '#22c55e' }} />
                  : <TrendingDown size={12} style={{ color: '#ef4444' }} />}
                <span style={{ color: change >= 0 ? '#22c55e' : '#ef4444' }}>
                  {Math.abs(change)}%
                </span>
              </>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
