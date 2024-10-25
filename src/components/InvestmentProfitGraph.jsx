import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getDatabase, ref, get } from 'firebase/database';
import firebaseApp from '../firebase/firebase'; // Import your Firebase config file

const InvestmentProfitGraph = () => {
    const [investmentData, setInvestmentData] = useState([]);
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const fetchInvestmentData = async () => {
            const user = 'akshat'; // Replace with actual user data if dynamic
            const db = getDatabase(firebaseApp);
            const investmentsRef = ref(db, `investments/${user}`);

            try {
                const snapshot = await get(investmentsRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const investmentArray = Object.values(data);

                    // Process investment data for plotting
                    const datesArray = investmentArray.map((item) => new Date(item.timestamp).toLocaleDateString());
                    const valuesArray = investmentArray.map((item) => parseFloat(item.amount));

                    setDates(datesArray);
                    setInvestmentData(valuesArray);
                } else {
                    console.log("No investment data found for the user.");
                }
            } catch (error) {
                console.error('Error fetching investment data:', error);
            }
        };

        fetchInvestmentData();
    }, []);

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Investment Value ($)',
                data: investmentData,
                fill: false,
                backgroundColor: '#FFD700', // Gold color for line
                borderColor: '#FFD700',
                tension: 0.4, // Smooth curve
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#FFD700',
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#FFFFFF' },
                grid: { color: 'rgba(255, 255, 255, 0.2)' },
            },
            y: {
                ticks: { color: '#FFFFFF' },
                grid: { color: 'rgba(255, 255, 255, 0.2)' },
            },
        },
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-gray-100">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Investment Value Over Time</h2>
            {investmentData.length ? (
                <Line data={data} options={options} />
            ) : (
                <p className="text-center text-gray-300">Loading investment data...</p>
            )}
        </div>
    );
};

export default InvestmentProfitGraph;
