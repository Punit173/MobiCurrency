import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Exchange = () => {
    const [historicalData, setHistoricalData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState("INR-USD");
    const [loading, setLoading] = useState(true);

    // Currency options
    const currencyPairs = ["INR-USD", "EUR-USD", "GBP-USD", "AUD-USD", "JPY-USD"];

    useEffect(() => {
        const fetchForecastData = async () => {
            setLoading(true); // Start loading before fetching data
            try {
                const response = await axios.get(`http://127.0.0.1:5000/forecast?pair=${selectedCurrencyPair}`);
                setHistoricalData(response.data.historical);
                setForecastData(response.data.forecast);
            } catch (error) {
                console.error("Error fetching forecast data:", error);
            }
            setLoading(false); // End loading after fetching data
        };

        fetchForecastData();
    }, [selectedCurrencyPair]);

    // Prepare data for the chart
    const dates = [
        ...historicalData.map(data => new Date(data.ds).toLocaleDateString()),
        ...forecastData.map(data => new Date(data.ds).toLocaleDateString())
    ];

    const actualRates = historicalData.map(data => data.y);
    const forecastedRates = forecastData.map(data => data.yhat);

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
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#D1D5DB' } },
            title: { display: true, text: `${selectedCurrencyPair.replace("-", " to ")} Exchange Rate Forecast`, color: '#F3F4F6', font: { size: 18 } }
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

    return (
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
                        <div className="text-yellow-400 text-center">Loading data...</div>
                    ) : (
                        <Line data={data} options={options} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exchange;



