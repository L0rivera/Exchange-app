import React, { useEffect, useState, useMemo } from "react";
import Select from 'react-select';
import type { SingleValue } from 'react-select'; 
interface OptionType {
  value: string;
  label: string;
}

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

  const currencyOptions: OptionType[] = useMemo(() => {
    return currencies.map((cur) => ({
      value: cur,
      label: cur,
    }));
  }, [currencies]);

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
      alert("Conversion error. Please try again.");
    }
  };
  
  const handleFromCurrencyChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      setFromCurrency(selectedOption.value);
    }
  };

  const handleToCurrencyChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      setToCurrency(selectedOption.value);
    }
  };
  
  const fromValue = currencyOptions.find(option => option.value === fromCurrency);
  const toValue = currencyOptions.find(option => option.value === toCurrency);


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
        <Select
          value={fromValue} 
          onChange={handleFromCurrencyChange}
          options={currencyOptions}
          className="basic-single"
          classNamePrefix="select"
          
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: '0.25rem', 
              padding: '0px', 
              minHeight: '2.5rem',
            }),
          }}
        />

        <label className="text-sm font-medium">To:</label>
        <Select
          value={toValue} 
          onChange={handleToCurrencyChange}
          options={currencyOptions}
          className="basic-single"
          classNamePrefix="select"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: '0.25rem', 
              padding: '0px', 
              minHeight: '2.5rem',
            }),
          }}
        />

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