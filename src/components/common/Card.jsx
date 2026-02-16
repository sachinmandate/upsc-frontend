import React from 'react';

const Card = ({ className = '', children }) => {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ className = '', children }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
);

const CardTitle = ({ className = '', children }) => (
  <h3 className={`text-base font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardDescription = ({ className = '', children }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ className = '', children }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent };