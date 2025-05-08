import * as React from "react";

export const Button = ({ className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};
