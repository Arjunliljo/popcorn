// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");

  const [convert, setConvert] = useState("Output");

  useEffect(() => {
    if (from === to) return setConvert(input);
    const fetchData = async () => {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${input}&from=${from}&to=${to}`
      );
      const data = await response.json();
      console.log(data.rates);
      setConvert(data?.rates[to]);
    };
    fetchData();
  }, [input, from, to]);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          if (!Number(e.target.value)) setInput("");
          setInput(Number(e.target.value));
        }}
      />
      <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <h1>{convert}</h1>
    </div>
  );
}
