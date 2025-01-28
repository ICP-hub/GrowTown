import React from 'react';

const BlueButton = ({ children }) => {
  return (
    <button
      className="px-4 py-2 bg-blue-700 text-white border border-white rounded-md hover:bg-yellow-400"
    >
      {children}
    </button>
  );
};

export default BlueButton;
