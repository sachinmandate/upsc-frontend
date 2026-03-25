import React from 'react';

const StatCard = ({ icon: Icon, label, value, trend, trendLabel }) => {
  const isPositive = trend === 'up';
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className="rounded-lg bg-gray-100 p-2">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-3xl font-bold tracking-tight text-gray-900">{value}</span>
      </div>
      {/* {trendLabel && (
        <p className="mt-2 text-xs text-gray-500">
          <span className={isPositive ? 'text-emerald-600' : 'text-red-500'}>
            {isPositive ? '↑' : '↓'} {trendLabel}
          </span>{' '}
          from last month
        </p>
      )} */}
    </div>
  );
};

export default StatCard;