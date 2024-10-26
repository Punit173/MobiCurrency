import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import firebaseApp from "../firebase/firebase";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Exchange = () => {
    const navigate = useNavigate();
    const [historicalData, setHistoricalData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState("INR-USD");
    const [loading, setLoading] = useState(false);
    const [buyRecommendation, setBuyRecommendation] = useState(null);
    const [selectedBookingDate, setSelectedBookingDate] = useState("");

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

                // Find the minimum positive forecast rate and its corresponding date
                const positiveForecasts = response.data.forecast.filter(data => data.yhat > 0);
                const minForecast = positiveForecasts.reduce((min, curr) => curr.yhat < min.yhat ? curr : min, positiveForecasts[0]);
                setBuyRecommendation({
                    date: new Date(minForecast.ds).toLocaleDateString(),
                    rate: minForecast.yhat
                });
            } catch (error) {
                console.error("Error fetching forecast data:", error);
                alert("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchForecastData();
    }, [selectedCurrencyPair]);

    const dates = [
        ...historicalData.map(data => new Date(data.ds).toLocaleDateString()),
        ...forecastData.map(data => new Date(data.ds).toLocaleDateString())
    ];

    const actualRates = historicalData.map(data => data.y);
    const forecastedRates = forecastData.map(data => data.yhat);

    // Data for the recommended buy point (highlighted on the chart)
    const buyPointIndex = forecastData.findIndex(data => new Date(data.ds).toLocaleDateString() === buyRecommendation?.date);
    const buyPointData = {
        label: 'Recommended Buy Rate',
        data: Array(historicalData.length + buyPointIndex).fill(null).concat(buyPointIndex !== -1 ? forecastData[buyPointIndex].yhat : null),
        borderColor: 'transparent',
        backgroundColor: '#FF6347',
        pointRadius: 6,
        pointHoverRadius: 8,
    };

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Actual Rate (Last 30 Days)',
                data: actualRates,
                borderColor: '#1D4ED8',
                backgroundColor: 'rgba(29, 78, 216, 0.1)',
                fill: true,
            },
            {
                label: 'Forecasted Rate (Next 30 Days)',
                data: Array(historicalData.length).fill(null).concat(forecastedRates),
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
            },
            buyPointData
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#D1D5DB' } },
            title: { display: true, text: `${selectedCurrencyPair} Exchange Rate Forecast`, color: '#F3F4F6', font: { size: 18 } }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                    color: '#F3F4F6'
                },
                ticks: {
                    color: '#9CA3AF'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Exchange Rate',
                    color: '#F3F4F6'
                },
                ticks: {
                    color: '#9CA3AF'
                }
            }
        }
    };

    const addCurrentPriceToFirebase = async () => {
        const db = getDatabase(firebaseApp);
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser || { uid: "akshat" };

        if (user) {
            const currentPrice = historicalData.length ? historicalData[historicalData.length - 1].y : null;
            const currentDate = new Date().toLocaleDateString();

            try {
                await set(ref(db, `currencyRates/${user.uid}/${currentDate}`), {
                    currencyPair: selectedCurrencyPair,
                    rate: currentPrice,
                });
                alert("Current price added to Firebase.");
            } catch (error) {
                console.error("Error adding current price to Firebase:", error);
                alert("Failed to add price. Please try again.");
            }
        } else {
            alert("User is not logged in.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                <div className="w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg p-6">
                    <div className="flex justify-center mb-6">
                        <select
                            className="bg-gray-700 text-yellow-400 p-2 rounded-lg outline-none"
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
                    <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
                        {selectedCurrencyPair.replace("-", " to ")} Exchange Rate Forecast
                    </h2>
                    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                        {loading ? (
                            <div className="text-white text-center">Loading...</div>
                        ) : (
                            <Line data={data} options={options} />
                        )}
                    </div>
                    {buyRecommendation && (
                        <p className="text-yellow-400 mt-4 text-center">
                            Suggested Buy Date: {buyRecommendation.date} at a rate of {buyRecommendation.rate.toFixed(2)}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-center space-y-4 my-8">
                    <select
                        className="bg-gray-700 text-yellow-400 p-2 rounded-lg outline-none"
                        value={selectedBookingDate}
                        onChange={(e) => setSelectedBookingDate(e.target.value)}
                    >
                        <option value="">Select Booking Date</option>
                        {forecastData.map((data, index) => (
                            <option key={index} value={data.ds}>
                                {new Date(data.ds).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                    <div className="flex space-x-4">
                        <button
                            className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-all duration-200"
                            onClick={addCurrentPriceToFirebase}
                        >
                            Add Current Price
                        </button>
                        <button
                            className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all duration-200"
                            onClick={() => navigate("/payment", { state: { currentPrice, selectedCurrencyPair, bookingDate: selectedBookingDate } })}
                        >
                            Book Currency
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Exchange;
