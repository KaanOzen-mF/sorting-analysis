import { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getDataset } from "./utils/dataGenerator";
import { quickSort } from "./algorithms/quickSort";
import { measurePerformance } from "./utils/performanceTracker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(1000);
  const [type, setType] = useState("random");
  const [history, setHistory] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);

  useEffect(() => {
    handleGenerate();
  }, []);

  // Take sample for large datasets to avoid browser lagging
  const sampledArray = useMemo(() => {
    if (array.length <= 200) return array;
    const step = Math.ceil(array.length / 200);
    return array.filter((_, idx) => idx % step === 0);
  }, [array]);

  // Chart.js data
  const chartData = {
    labels: history.map((h, i) => `${h.algorithm} #${i + 1} (${h.size})`),
    datasets: [
      {
        label: "Execution Time (ms)",
        data: history.map((h) => h.time),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const handleGenerate = () => {
    const newArray = getDataset(type, size);
    setArray(newArray);
    setActiveIndices([]);
  };

  const handleSort = async () => {
    if (!array || array.length === 0) return;
    setIsSorting(true);

    try {
      // 1. VISUALIZATION MODE (Animation only for small arrays)
      if (size <= 200) {
        await quickSort(
          [...array],
          0,
          array.length - 1,
          (tempArray, indices) => {
            setArray(tempArray);
            setActiveIndices(indices);
          },
          30
        );
      }

      // 2. ANALYSIS MODE (Official performance measurement)
      const data = await measurePerformance(quickSort, array);

      setHistory((prev) => [
        ...prev,
        { ...data, size, type, algorithm: "Quick Sort" },
      ]);
      setArray(data.sortedArray);
      setActiveIndices([]);
    } catch (error) {
      console.error("Sorting error:", error);
    } finally {
      setIsSorting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Algorithms Course Term Project
            </h1>
            <p className="text-sm text-gray-500">
              Performance Analysis & Visualization
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Current Array Status
              </p>
              <p className="text-sm font-medium">
                {array.length.toLocaleString()} Elements
              </p>
            </div>
          </div>
        </header>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
            Generate Data
          </button>
          <button
            onClick={handleSort}
            disabled={isSorting || array.length === 0}
            className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg self-end hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSorting ? "Analyzing..." : "Start Analysis"}
          </button>
        </div>

        {/* 1. GRAPH: Bar Visualization (Visual Mode)  */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase italic">
            Real-Time Data Visualization
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2. GRAPH: Time Analysis (Chart.js) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Performance Graph (Time)
            </h2>
            <div className="h-64">
              <Line
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          {/* 3. TABLE: Comparison Results */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Experimental Results
            </h2>
            <div className="overflow-x-auto h-64">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                  <tr>
                    <th className="p-3 border">Algorithm</th>
                    <th className="p-3 border">Size</th>
                    <th className="p-3 border">Type</th>
                    <th className="p-3 border">Time (ms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-medium text-blue-700">
                        {h.algorithm}
                      </td>
                      <td className="p-3 text-gray-600">
                        {h.size.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-600 capitalize">{h.type}</td>
                      <td className="p-3 font-bold text-emerald-600">
                        {h.time}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-8 text-center text-gray-400 italic"
                      >
                        No analysis results yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
