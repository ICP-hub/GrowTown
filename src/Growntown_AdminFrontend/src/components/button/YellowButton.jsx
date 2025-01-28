import React from "react";

function YellowButton({ children, methodName }) {
  return (
    <button
      className="px-4 py-2 bg-[#50B248] text-white  font-semibold rounded-md hover:bg-yellow-500 hover:border-yellow-500"
      onClick={methodName}
    >
      {children}
    </button>
  );
}

export default YellowButton;