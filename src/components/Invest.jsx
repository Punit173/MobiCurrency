import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import firebaseApp from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { FaDollarSign, FaEuroSign, FaPoundSign, FaYenSign, FaRupeeSign } from 'react-icons/fa';
import InvestmentProfit from './InvestmentProfit';
import InvestmentProfitGraph from './InvestmentProfitGraph';
import Navbar from './Navbar';

const Invest = () => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [message, setMessage] = useState('');
    const [currencyBalances, setCurrencyBalances] = useState({});
    const db = getDatabase(firebaseApp);
    const auth = getAuth(firebaseApp);

    useEffect(() => {
        const fetchWalletData = async () => {
            const user = "akshat"; // Using static user as specified

            const purchasesRef = ref(db, `purchases/${user}`);
            try {
                const snapshot = await get(purchasesRef);
                if (snapshot.exists()) {
                    const purchases = snapshot.val();
                    const currencyTotals = {};

                    // Aggregate balances per currency
                    Object.values(purchases).forEach(purchase => {
                        const { currencyPair, totalCost } = purchase;
                        const currency = currencyPair.split('-')[0]; // Get the currency from the pair (e.g., "GBP" from "GBP-USD")
                        currencyTotals[currency] = (currencyTotals[currency] || 0) + parseFloat(totalCost);
                    });

                    setCurrencyBalances(currencyTotals);
                }
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            }
        };

        fetchWalletData();
    }, []);

    const handleInvestment = async (e) => {
        e.preventDefault();
        const user = "akshat"; // Using static user as specified

        if (!user) {
            setMessage('You must be logged in to invest.');
            return;
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            setMessage('Please enter a valid amount.');
            return;
        }

        // Check if amount exceeds total balance in the selected currency
        if (parseFloat(amount) > (currencyBalances[currency] || 0)) {
            setMessage('You cannot invest more than your available balance.');
            return;
        }

        const investmentData = {
            currencyPair: `${currency}-USD`, // Assuming all investments are converted to USD
            amount: amount,
            timestamp: Date.now(),
        };

        try {
            // Store the investment
            await set(ref(db, `investments/${user}/${Date.now()}`), investmentData);

            // Deduct from the wallet
            const updatedBalance = (currencyBalances[currency] || 0) - parseFloat(amount);
            await set(ref(db, `purchases/${user}/${currency}-USD-${Date.now()}`), {
                currencyPair: `${currency}-USD`, // Reflecting that it's a deduction
                totalCost: -parseFloat(amount), // Update total cost accordingly
            });

            // Update currency balance state
            setCurrencyBalances(prevBalances => ({
                ...prevBalances,
                [currency]: updatedBalance,
            }));

            setMessage(`Successfully invested ${amount} ${currency}!`);
            setAmount('');
        } catch (error) {
            console.error('Error investing money:', error);
            setMessage('Failed to invest, please try again later.');
        }
    };

    return (
        <>
            <Navbar/>
            <div className="bg-gray-900 min-h-screen text-gray-100 p-6">
                <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Invest Money</h1>

                {/* Display all currency balances */}
                <div className="text-center text-yellow-400 mb-4">
                    {Object.entries(currencyBalances).map(([currency, balance]) => (
                        <p key={currency}>{currency}: {balance.toFixed(2)}</p>
                    ))}
                </div>

                <form onSubmit={handleInvestment} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-yellow-400 mb-2" htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 bg-gray-600 text-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-yellow-400 mb-2" htmlFor="currency">Currency</label>
                        <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full p-2 bg-gray-600 text-gray-300 rounded"
                        >
                            <option value="USD"><FaDollarSign /> USD</option>
                            <option value="EUR"><FaEuroSign /> EUR</option>
                            <option value="GBP"><FaPoundSign /> GBP</option>
                            <option value="JPY"><FaYenSign /> JPY</option>
                            <option value="INR"><FaRupeeSign /> INR</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition"
                    >
                        Invest
                    </button>
                </form>
                {message && <p className="mt-4 text-yellow-400 text-center">{message}</p>}

                <InvestmentProfit user="akshat" />
                <InvestmentProfitGraph />
            </div>
        </>
    );
};

export default Invest;
