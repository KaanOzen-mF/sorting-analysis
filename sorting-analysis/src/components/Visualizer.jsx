import React, { useMemo } from "react";

const Visualizer = ({ array, activeIndices }) => {
  // UI Performansı için örnekleme mantığı burada
  const sampledArray = useMemo(() => {
    if (array.length <= 200) return array;
    const step = Math.ceil(array.length / 200);
    return array.filter((_, idx) => idx % step === 0);
  }, [array]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase italic">
        Visual Analysis Area
      </h2>
      <div className="h-48 flex items-end gap-[1px] bg-gray-50 p-2 rounded-lg overflow-hidden border border-inner">
        {sampledArray.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          return (
            <div
              key={idx}
              style={{
                height: `${(val / (Math.max(...array) || 1)) * 100}%`,
              }}
              className={`flex-1 transition-all duration-75 ${
                isActive ? "bg-red-500" : "bg-blue-500 opacity-80"
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Visualizer;
