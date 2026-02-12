import React from 'react';

const Textarea = ({ label, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        className={`flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default Textarea;