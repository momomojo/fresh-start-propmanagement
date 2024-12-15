import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className=" flex justify-center items-center" data-testid="loading-spinner">
      <div className="w-8 h-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
    </div>
  );
};

export default LoadingSpinner;
