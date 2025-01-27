import React from "react";

function YellowButton({ children, methodName }) {
  return (
    <button
      className="px-4 py-2 bg-yellow-400 text-black border border-yellow-400 rounded-md hover:bg-yellow-500 hover:border-yellow-500"
      onClick={methodName}
    >
      {children}
    </button>
  );
}

export default YellowButton;