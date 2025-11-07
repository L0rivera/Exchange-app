import React from "react";
import CurrencyConverter from "./components/CurrencyConverter";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">💱 Currency Converter</h1>
      <CurrencyConverter />
    </div>
  );
};

export default App;
