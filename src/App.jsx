// Author: Mit Jain
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  // --- State for Live Data ---
  const [weather, setWeather] = useState(null);
  const [rates, setRates] = useState(null);
  const [citizen, setCitizen] = useState(null);
  const [fact, setFact] = useState(null);

  // --- State for Chatbot ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', text: 'System online. How can I assist you with the dashboard data?' }
  ]);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // --- API Fetch Functions ---
  const fetchWeather = async () => {
    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.86&current_weather=true");
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (error) {
      console.error("Failed to load weather", error);
    }
  };

  const fetchCurrency = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      const inrToUsd = 1 / data.rates.INR;
      setRates({
        USD: inrToUsd.toFixed(4),
        EUR: (inrToUsd * data.rates.EUR).toFixed(4),
        GBP: (inrToUsd * data.rates.GBP).toFixed(4)
      });
    } catch (error) {
      console.error("Failed to load currency", error);
    }
  };

  const fetchCitizen = async () => {
    try {
      const res = await fetch("https://randomuser.me/api/");
      const data = await res.json();
      const user = data.results[0];
      setCitizen({
        name: `${user.name.first} ${user.name.last}`,
        city: user.location.city,
        email: user.email,
        photo: user.picture.medium
      });
    } catch (error) {
      console.error("Failed to load citizen", error);
    }
  };

  const fetchFact = async () => {
    try {
      const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
      const data = await res.json();
      setFact({ text: data.text });
    } catch (error) {
      console.error("Failed to load fact", error);
    }
  };

  // Initialize all data on load
  useEffect(() => {
    fetchWeather();
    fetchCurrency();
    fetchCitizen();
    fetchFact();
  }, []);

  // --- Chatbot Logic ---
  const queryAI = async (data) => {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userQuestion = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userQuestion }]);
    setInputText("");
    setIsThinking(true);

    const liveContext = `
      You are a helpful SmartCity assistant. 
      Answer only based on the following live data from the dashboard:

      WEATHER: Temperature is ${weather?.temperature || 'N/A'}°C, 
               Wind speed is ${weather?.windspeed || 'N/A'} km/h
      CURRENCY: 1 INR = ${rates?.USD || 'N/A'} USD, 
                1 INR = ${rates?.EUR || 'N/A'} EUR, 
                1 INR = ${rates?.GBP || 'N/A'} GBP
      CITIZEN ON SCREEN: ${citizen?.name || 'N/A'}, 
                         from ${citizen?.city || 'N/A'}, 
                         email: ${citizen?.email || 'N/A'}
      CITY FACT: ${fact?.text || 'N/A'}

      If the user asks something not related to this data, 
      politely say you only know about the dashboard data. Do not make up information.
    `;

    try {
      const response = await queryAI({
        messages: [
          { role: "system", content: liveContext },
          { role: "user", content: userQuestion }
        ],
        model: "openai/gpt-oss-120b:groq" 
      });

      if (response.choices && response.choices.length > 0) {
        setMessages(prev => [...prev, { role: 'system', text: response.choices[0].message.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'error', text: 'Error: No valid response from AI.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', text: 'Network Error. Check console.' }]);
      console.error("Fetch error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <header>
        <h1 className="glow-text">SmartCity Citizen Dashboard</h1>
        <p>Real-time telemetry for our citizens</p>
      </header>

      <main className="dashboard-grid">
        {/* Weather Card */}
        <div className="card glass">
          <div className="card-header">
            <h2>Live Weather</h2>
            <span className="icon">🌤️</span>
          </div>
          <div className="data-content">
            {weather ? (
              <>
                <strong>Temp:</strong> {weather.temperature}°C <br />
                <strong>Wind:</strong> {weather.windspeed} km/h <br />
                <strong>Code:</strong> {weather.weathercode}
              </>
            ) : "Loading live feeds..."}
          </div>
          <button className="neon-btn" onClick={fetchWeather}>Sync Weather</button>
        </div>

        {/* Currency Card */}
        <div className="card glass">
          <div className="card-header">
            <h2>Currency Rates</h2>
            <span className="icon">💱</span>
          </div>
          <div className="data-content">
            {rates ? (
              <>
                1 INR = {rates.USD} USD <br />
                1 INR = {rates.EUR} EUR <br />
                1 INR = {rates.GBP} GBP
              </>
            ) : "Loading live feeds..."}
          </div>
          <button className="neon-btn" onClick={fetchCurrency}>Sync Currency</button>
        </div>

        {/* Citizen Card */}
        <div className="card glass">
          <div className="card-header">
            <h2>Featured Citizen</h2>
            <span className="icon">👤</span>
          </div>
          <div className="data-content">
            {citizen ? (
              <>
                <img src={citizen.photo} alt="Citizen" style={{ borderRadius: '50%', width: '50px' }} /><br />
                <strong>Name:</strong> {citizen.name} <br />
                <strong>City:</strong> {citizen.city} <br />
                <strong>Email:</strong> {citizen.email}
              </>
            ) : "Loading live feeds..."}
          </div>
          <button className="neon-btn" onClick={fetchCitizen}>Sync Profile</button>
        </div>

        {/* Fact Card */}
        <div className="card glass">
          <div className="card-header">
            <h2>City Fact of the Day</h2>
            <span className="icon">🏙️</span>
          </div>
          <div className="data-content">
            {fact ? <em>"{fact.text}"</em> : "Loading live feeds..."}
          </div>
          <button className="neon-btn" onClick={fetchFact}>Sync Fact</button>
        </div>
      </main>

      {/* Chatbot Window */}
      <div className="chat-container glass" style={{ display: isChatOpen ? 'flex' : 'none' }}>
        <div className="chat-header">
          <h3><span className="status-dot"></span> Smart Assistant</h3>
          <button onClick={() => setIsChatOpen(false)} className="close-btn">✖</button>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {isThinking && <div className="message system">Thinking...</div>}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input-area">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your query..." 
          />
          <button className="neon-btn send-btn" onClick={sendMessage}>Send</button>
        </div>
      </div>
      
      {/* Chat Toggle Button */}
      <button className="chat-toggle-btn neon-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
        <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8zm0 2c-4.42 0-8 2.69-8 6 0 1.7.94 3.23 2.45 4.22.42.28.66.78.58 1.28-.13.84-.52 1.95-1.34 3.03 1.5-.24 2.85-.73 3.86-1.37.38-.24.84-.28 1.26-.14C11.53 18.84 12 19 12 19c4.42 0 8-2.69 8-6s-3.58-6-8-6z"></path>
        </svg>
      </button>
    </>
  );
}