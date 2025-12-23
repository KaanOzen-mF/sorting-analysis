import React from "react";

const Header = ({ arrayLength }) => {
  return (
    <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Algorithms Course Term Project
        </h1>
        <p className="text-sm text-gray-500 italic">
          Performance Analysis of Sorting Algorithms
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-gray-400 uppercase">
          Current Array Status
        </p>
        <p className="text-sm font-medium">
          {arrayLength.toLocaleString()} Elements
        </p>
      </div>
    </header>
  );
};

export default Header;
