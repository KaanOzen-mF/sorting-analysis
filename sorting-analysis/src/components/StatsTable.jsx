import React from "react";

const StatsTable = ({ history }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-widest">
        Technical Result Logs
      </h2>
      <div className="overflow-x-auto h-64">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 sticky top-0">
            <tr>
              <th className="p-3 border">Algorithm</th>
              <th className="p-3 border">Size</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border text-blue-600">Time (ms)</th>
              <th className="p-3 border text-emerald-600">Memory (KB)</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {history.map((h, i) => (
              <tr key={i} className="hover:bg-blue-50 transition">
                <td className="p-3 font-medium text-blue-700">{h.algorithm}</td>
                <td className="p-3 text-gray-600">{h.size.toLocaleString()}</td>
                <td className="p-3 text-gray-600 capitalize">{h.type}</td>
                <td className="p-3 font-bold text-blue-600">{h.time}</td>
                <td className="p-3 font-bold text-emerald-600">{h.memory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;
