import React, { useEffect, useState } from "react";

interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);

  const API_URL = "https://api.exchangerate-api.com/v4/latest/";

  useEffect(() => {
    fetch(API_URL + "USD")
      .then((res) => res.json())
      .then((data: ExchangeRatesResponse) => {
        setCurrencies(Object.keys(data.rates));
      })
      .catch((err) => console.error("Error fetching currencies:", err));
  }, []);

  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch(`${API_URL}${fromCurrency}`);
      const data: ExchangeRatesResponse = await res.json();
      const rate = data.rates[toCurrency];
      const conversion = (amount * rate).toFixed(2);
      setResult(conversion);
    } catch (error) {
      console.error("Conversion error:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-80">
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded p-2"
        />

        <label className="text-sm font-medium">From:</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border rounded p-2"
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium">To:</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border rounded p-2"
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white font-medium rounded p-2 hover:bg-blue-600 transition"
        >
          Convert
        </button>

        {result && (
          <div className="mt-4 text-center text-lg font-semibold">
            {amount} {fromCurrency} = {result} {toCurrency}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
