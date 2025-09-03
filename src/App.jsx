import React from "react";
import Routes from "./Routes";
import { AnalysisProvider } from "./contexts/AnalysisContext";
import GlobalVoxaAssistant from "./components/ui/GlobalVoxaAssistant";

function App() {
  return (
    <AnalysisProvider>
      <Routes />
      <GlobalVoxaAssistant />
    </AnalysisProvider>
  );
}

export default App;
