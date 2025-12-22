import { useState, useEffect, useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getDataset } from "./utils/dataGenerator";
import { quickSort } from "./algorithms/quickSort";
import { heapSort } from "./algorithms/heapSort";
import { measurePerformance } from "./utils/performanceTracker";
import { mergeSort } from "./algorithms/mergeSort";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [selectedAlgo, setSelectedAlgo] = useState("quick");

  useEffect(() => {
    handleGenerate();
  }, []);

  const sampledArray = useMemo(() => {
    if (array.length <= 200) return array;
    const step = Math.ceil(array.length / 200);
    return array.filter((_, idx) => idx % step === 0);
  }, [array]);

  // 1. Line Chart: Time History
  const lineChartData = {
    labels: history.map((h, i) => `${h.algorithm} #${i + 1}`),
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

  // 2. Bar Chart: Algorithm Comparison
  const barChartData = useMemo(() => {
    const algos = ["Quick Sort", "Heap Sort", "Merge Sort"];
    const latestResults = algos.map((algo) => {
      const results = history.filter(
        (h) => h.algorithm === algo && h.size === size
      );
      return results.length > 0 ? results[results.length - 1].time : 0;
    });

    return {
      labels: algos,
      datasets: [
        {
          label: `Performance for Size ${size.toLocaleString()} (ms)`,
          data: latestResults,
          backgroundColor: [
            "rgba(59, 130, 246, 0.6)",
            "rgba(16, 185, 129, 0.6)",
          ],
          borderColor: ["rgb(59, 130, 246)", "rgb(16, 185, 129)"],
          borderWidth: 1,
        },
      ],
    };
  }, [history, size]);

  // 3. Column Chart: Memory Usage Comparison
  const memoryBarChartData = useMemo(() => {
    const algos = ["Quick Sort", "Heap Sort", "Merge Sort"];
    const latestMemory = algos.map((algo) => {
      const results = history.filter(
        (h) => h.algorithm === algo && h.size === size
      );
      // Convert memory from bytes to KB
      return results.length > 0
        ? (results[results.length - 1].memory / 1024).toFixed(2)
        : 0;
    });

    return {
      labels: algos,
      datasets: [
        {
          label: `Memory Usage for Size ${size.toLocaleString()} (KB)`,
          data: latestMemory,
          backgroundColor: [
            "rgba(249, 115, 22, 0.6)", // Turuncu (Quick)
            "rgba(139, 92, 246, 0.6)", // Mor (Heap)
            "rgba(236, 72, 153, 0.6)", // Pembe (Merge)
          ],
          borderColor: [
            "rgb(249, 115, 22)",
            "rgb(139, 92, 246)",
            "rgb(236, 72, 153)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [history, size]);

  const handleGenerate = () => {
    const newArray = getDataset(type, size);
    setArray(newArray);
    setActiveIndices([]);
  };

  const handleSort = async () => {
    if (!array || array.length === 0) return;
    setIsSorting(true);

    const algorithms = {
      quick: { fn: quickSort, name: "Quick Sort" },
      heap: { fn: heapSort, name: "Heap Sort" },
      merge: { fn: mergeSort, name: "Merge Sort" },
    };

    const current = algorithms[selectedAlgo];

    try {
      if (size <= 200) {
        await current.fn(
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

      const data = await measurePerformance(current.fn, array);
      setHistory((prev) => [
        ...prev,
        { ...data, size, type, algorithm: current.name },
      ]);
      setArray(data.sortedArray);
      setActiveIndices([]);
    } catch (error) {
      console.error("Error:", error);
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
            <p className="text-sm text-gray-500 italic">
              Performance Analysis of Sorting Algorithms
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Array Size
            </p>
            <p className="text-sm font-medium">
              {array.length.toLocaleString()} Elements
            </p>
          </div>
        </header>

        {/* Control Panel  */}
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
              <option value="quick">Quick Sort </option>
              <option value="heap">Heap Sort </option>
              <option value="merge">Merge Sort </option>
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
            disabled={isSorting || array.length === 0}
            className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg self-end hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSorting ? "Analyzing..." : "Start Analysis"}
          </button>
        </div>

        {/* Real-Time Visualization */}
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

        {/* Comparative Charts  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time Comparison */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">
              Time Comparison (ms)
            </h2>
            <div className="h-64">
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          {/* Memory Comparison */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold mb-4 uppercase text-gray-400">
              Memory Usage (KB)
            </h2>
            <div className="h-64">
              <Bar
                data={memoryBarChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          {/* Execution History */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">
              Execution History
            </h2>
            <div className="h-64">
              <Line
                data={lineChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Experimental Results Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-widest">
            Technical Result Logs
          </h2>
          <div className="overflow-x-auto h-64">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 sticky top-0">
                <tr>
                  <th className="p-3 border">Algorithm </th>
                  <th className="p-3 border">Size</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border text-blue-600">Time (ms)</th>
                  <th className="p-3 border text-emerald-600">Memory (B) </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition">
                    <td className="p-3 font-medium text-blue-700">
                      {h.algorithm}
                    </td>
                    <td className="p-3 text-gray-600">
                      {h.size.toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-600 capitalize">{h.type}</td>
                    <td className="p-3 font-bold text-blue-600">{h.time}</td>
                    <td className="p-3 font-bold text-emerald-600">
                      {h.memory}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
