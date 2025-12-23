import React from "react";

const ControlPanel = ({
  selectedAlgo,
  setSelectedAlgo,
  size,
  setSize,
  type,
  setType,
  isSorting,
  handleGenerate,
  handleSort,
  arrayLength,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
          Algorithm
        </label>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="w-full border p-2 rounded-lg bg-gray-50 outline-none focus:ring-2 ring-blue-500"
        >
          <option value="quick">Quick Sort</option>
          <option value="heap">Heap Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="shell">Shell Sort</option>
          <option value="radix">Radix Sort</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
          Data Size
        </label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full border p-2 rounded-lg bg-gray-50 outline-none focus:ring-2 ring-blue-500"
        >
          <option value={100}>100 (Visual Mode)</option>
          <option value={1000}>1,000 (Small)</option>
          <option value={10000}>10,000 (Medium)</option>
          <option value={100000}>100,000 (Large)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
          Dataset Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded-lg bg-gray-50 outline-none focus:ring-2 ring-blue-500"
        >
          <option value="random">Randomly Ordered</option>
          <option value="partiallySorted">Partially Sorted</option>
          <option value="reverse">Reverse Ordered</option>
        </select>
      </div>
      <button
        onClick={handleGenerate}
        disabled={isSorting}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg self-end hover:bg-blue-700 transition disabled:opacity-50"
      >
        Generate
      </button>
      <button
        onClick={handleSort}
        disabled={isSorting || arrayLength === 0}
        className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg self-end hover:bg-emerald-700 transition disabled:opacity-50"
      >
        {isSorting ? "Analyzing..." : "Start Analysis"}
      </button>
    </div>
  );
};

export default ControlPanel;
