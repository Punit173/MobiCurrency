import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home = () => {
    const [historicalData, setHistoricalData] = useState([]);
    const [forecastData, setForecastData] = useState([]);

    useEffect(() => {
        // Fetch data from Flask backend
        const fetchForecastData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/forecast');
                setHistoricalData(response.data.historical);
                setForecastData(response.data.forecast);
            } catch (error) {
                console.error("Error fetching forecast data:", error);
            }
        };

        fetchForecastData();
    }, []);

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
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                fill: true,
            },
            {
                label: 'Forecasted Rate (Next 30 Days)',
                data: Array(historicalData.length).fill(null).concat(forecastedRates),
                borderColor: 'orange',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                fill: true,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'INR to USD Exchange Rate Forecast' }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Exchange Rate'
                }
            }
        }
    };

    return (
        <div>
            <h2>INR to USD Exchange Rate Forecast</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default Home;
