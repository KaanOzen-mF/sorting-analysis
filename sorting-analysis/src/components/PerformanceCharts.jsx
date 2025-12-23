import React, { useMemo } from "react";
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

const PerformanceCharts = ({ history, size }) => {
  // 1. Line Chart Data
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

  // 2. Bar Chart Data (Time)
  const barChartData = useMemo(() => {
    const algos = [
      "Quick Sort",
      "Heap Sort",
      "Merge Sort",
      "Shell Sort",
      "Radix Sort",
    ];
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
          label: `Time (ms)`,
          data: latestResults,
          backgroundColor: [
            "rgba(59, 130, 246, 0.6)",
            "rgba(139, 92, 246, 0.6)",
            "rgba(236, 72, 153, 0.6)",
            "rgba(34, 197, 94, 0.6)",
            "rgba(20, 184, 166, 0.6)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(139, 92, 246)",
            "rgb(236, 72, 153)",
            "rgb(34, 197, 94)",
            "rgb(20, 184, 166)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [history, size]);

  // 3. Bar Chart Data (Memory)
  const memoryBarChartData = useMemo(() => {
    const algos = [
      "Quick Sort",
      "Heap Sort",
      "Merge Sort",
      "Shell Sort",
      "Radix Sort",
    ];
    const latestMemory = algos.map((algo) => {
      const results = history.filter(
        (h) => h.algorithm === algo && h.size === size
      );
      return results.length > 0
        ? (results[results.length - 1].memory / 1024).toFixed(2)
        : 0;
    });

    return {
      labels: algos,
      datasets: [
        {
          label: `Memory (KB)`,
          data: latestMemory,
          backgroundColor: [
            "rgba(59, 130, 246, 0.6)",
            "rgba(139, 92, 246, 0.6)",
            "rgba(236, 72, 153, 0.6)",
            "rgba(34, 197, 94, 0.6)",
            "rgba(20, 184, 166, 0.6)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(139, 92, 246)",
            "rgb(236, 72, 153)",
            "rgb(34, 197, 94)",
            "rgb(20, 184, 166)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [history, size]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">
          Time Comparison
        </h2>
        <div className="h-64">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-sm font-bold mb-4 uppercase text-gray-400">
          Memory Usage
        </h2>
        <div className="h-64">
          <Bar data={memoryBarChartData} options={barOptions} />
        </div>
      </div>
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
  );
};

export default PerformanceCharts;
