import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import { FaDollarSign, FaEuroSign, FaPoundSign, FaYenSign, FaRubleSign, FaShekelSign } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation
import Navbar from './Navbar';

// Icon mapping for different currencies
const currencyIcons = {
    USD: <FaDollarSign />,
    EUR: <FaEuroSign />,
    GBP: <FaPoundSign />,
    JPY: <FaYenSign />,
    RUB: <FaRubleSign />,
    ILS: <FaShekelSign />,
    // Add more currency mappings as needed
};

const Rate = () => {
    const [currencyRates, setCurrencyRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCurrencyRates = async () => {
            try {
                const response = await axios.get('https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_ambK1m9GjAtcf1uctoyoY2CyfJWocJ4OUxbyK3Uh');
                setCurrencyRates(Object.entries(response.data.data));
                setLoading(false);
            } catch (err) {
                setError('Error fetching currency rates. Please try again later.');
                setLoading(false);
            }
        };

        fetchCurrencyRates();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>Loading currency rates...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
        <Navbar/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
                <h1 className="text-2xl font-bold text-yellow-400 mb-4">
                    <TypeAnimation
                        sequence={[
                            'Currency Rates', // The text to type
                            1000, // Wait 1 second
                        ]}
                        speed={50} // Typing speed in milliseconds
                        style={{ fontSize: '1.5em' }} // Custom styles
                        repeat={0} // Set to 0 to stop after one iteration
                    />
                </h1>
                <div className="bg-black bg-opacity-80 shadow-lg rounded-lg p-6 w-4/5 max-w-full">
                    <ul>
                        {currencyRates.map(([currency, rate]) => (
                            <li key={currency} className="flex justify-between mb-2 bg-slate-900 p-3 rounded-sm hover:bg-cyan-900">
                                <span className="flex items-center">
                                    {currencyIcons[currency] || <FaDollarSign className="inline mr-1" />} {/* Default icon if not found */}
                                    {currency}
                                </span>
                                <span>{rate.toFixed(4)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Rate;
