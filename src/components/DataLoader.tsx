import React from 'react';

const DataLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 bg-[#4494cc] rounded-full animate-bounce"></div>
          <div className="absolute inset-4 border-4 border-[#4494cc] rounded-full animate-pulse"></div>
        </div>
        <div className="mt-6 space-y-2 text-center">
          <p className="text-2xl font-bold text-[#4494cc] tracking-wider animate-pulse">
            Loading
          </p>
          <p className="text-sm text-[#4494cc] animate-pulse delay-500">
            Please wait while data is being processed...
          </p>
        </div>
        <div className="mt-4 w-48 h-1 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#4494cc] animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default DataLoader;