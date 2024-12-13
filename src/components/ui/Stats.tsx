import React from 'react';

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{value}</h3>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatItem;