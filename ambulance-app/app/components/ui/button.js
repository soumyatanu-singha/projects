import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-5 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-semibold transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
