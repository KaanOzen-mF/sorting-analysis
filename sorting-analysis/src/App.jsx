import React from "react";
import { useSorting } from "./hooks/useSorting";

// Bileşenleri İçe Aktar
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import Visualizer from "./components/Visualizer";
import PerformanceCharts from "./components/PerformanceCharts";
import StatsTable from "./components/StatsTable";

function App() {
  const {
    array,
    size,
    setSize,
    type,
    setType,
    history,
    isSorting,
    activeIndices,
    selectedAlgo,
    setSelectedAlgo,
    handleGenerate,
    runAnalysis,
  } = useSorting(1000, "random");

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header arrayLength={array.length} />

        <ControlPanel
          selectedAlgo={selectedAlgo}
          setSelectedAlgo={setSelectedAlgo}
          size={size}
          setSize={setSize}
          type={type}
          setType={setType}
          isSorting={isSorting}
          handleGenerate={handleGenerate}
          handleSort={runAnalysis}
          arrayLength={array.length}
        />
        <Visualizer array={array} activeIndices={activeIndices} />

        <PerformanceCharts history={history} size={size} />

        <StatsTable history={history} />
      </div>
    </div>
  );
}

export default App;
