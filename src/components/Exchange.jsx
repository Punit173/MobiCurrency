import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import firebaseApp from "../firebase/firebase";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Exchange = () => {
    const [historicalData, setHistoricalData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState("INR-USD");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const currencyPairs = ["INR-USD", "EUR-USD", "GBP-USD", "AUD-USD", "JPY-USD"];
    const currencyPairMapping = {
        "INR-USD": "USDINR=X",
        "EUR-USD": "USDEUR=X",
        "GBP-USD": "USDGBP=X",
        "AUD-USD": "USDAUD=X",
        "JPY-USD": "USDJPY=X",
    };

    useEffect(() => {
        const fetchForecastData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:5000/forecast?pair=${currencyPairMapping[selectedCurrencyPair]}`);
                setHistoricalData(response.data.historical);
                setForecastData(response.data.forecast);
            } catch (error) {
                console.error("Error fetching forecast data:", error);
            }
            setLoading(false);
        };

        fetchForecastData();
    }, [selectedCurrencyPair]);

    const addCurrentPriceToFirebase = async () => {
        const db = getDatabase(firebaseApp);
        const auth = getAuth(firebaseApp);
        const user = "akshat"; /* auth.currentUser */;

        if (user) {
            const currentPrice = historicalData.length ? historicalData[historicalData.length - 1].y : null;
            const currentDate = new Date().toLocaleDateString();

            try {
                await set(ref(db, `currencyRates/${user/* .uid */}/${currentDate}`), {
                    currencyPair: selectedCurrencyPair,
                    rate: currentPrice,
                });
                alert("Current price added to Firebase.");
            } catch (error) {
                console.error("Error adding current price to Firebase:", error);
            }
        } else {
            alert("User is not logged in.");
        }
    };

    const currentPrice = historicalData.length ? historicalData[historicalData.length - 1].y : 0;

    const data = {
        labels: [
            ...historicalData.map((point) => point.ds),
            ...forecastData.map((point) => point.ds) // Combine historical and forecast dates
        ],
        datasets: [
            {
                label: 'Historical Rate (Last 30 Days)',
                data: historicalData.map((point) => point.y),
                borderColor: '#1E90FF',
                backgroundColor: 'rgba(30, 144, 255, 0.1)',
                fill: true,
            },
            {
                label: 'Predicted Rate (Next 30 Days)',
                data: [
                    ...Array(historicalData.length).fill(null), // Align with historical data
                    ...forecastData.map((point) => point.yhat) // Add forecasted data points
                ],
                borderColor: '#FF8C00',
                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                fill: true,
                borderDash: [5, 5],
            }
        ]
    };
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            },
            title: {
                display: true,
                text: `${selectedCurrencyPair.replace("-", " to ")} Exchange Rate Forecast`,
                color: '#FBBF24'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white'
                }
            },
            y: {
                ticks: {
                    color: 'white'
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="w-full max-w-4xl bg-gray-900 shadow-lg rounded-lg p-6">
                <div className="flex justify-center mb-6">
                    <select
                        className="bg-gray-800 text-yellow-400 p-3 rounded-lg outline-none shadow-md"
                        value={selectedCurrencyPair}
                        onChange={(e) => setSelectedCurrencyPair(e.target.value)}
                    >
                        {currencyPairs.map((pair) => (
                            <option key={pair} value={pair}>
                                {pair.replace("-", " to ")}
                            </option>
                        ))}
                    </select>
                </div>
                <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
                    {selectedCurrencyPair.replace("-", " to ")} Exchange Rate Forecast
                </h2>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    {loading ? (
                        <div className="text-yellow-400 text-center text-lg">Loading data...</div>
                    ) : (
                        <Line data={data} options={options} />
                    )}
                </div>
            </div>
            <div className="flex space-x-4 my-8">
                <button
                    className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-all duration-200"
                    onClick={addCurrentPriceToFirebase}
                >
                    Add Current Price
                </button>
                <button
                    className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all duration-200"
                    onClick={() => navigate("/payment", { state: { currentPrice, selectedCurrencyPair } })}
                >
                    Buy Currency
                </button>
            </div>
        </div>
    );
};

export default Exchange;
