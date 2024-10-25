import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import axios from 'axios';

const InvestmentProfit = ({ user }) => {
    const [investments, setInvestments] = useState([]);
    const [currentGoldPrice, setCurrentGoldPrice] = useState(null);
    const [profits, setProfits] = useState([]);

    const db = getDatabase();

    useEffect(() => {
        const fetchInvestments = async () => {
            const investmentsRef = ref(db, `investments/${user}`);
            const snapshot = await get(investmentsRef);

            if (snapshot.exists()) {
                setInvestments(Object.values(snapshot.val()));
            }
        };

        fetchInvestments();
    }, [user]);

    useEffect(() => {
        const fetchGoldPrice = async () => {
            try {
                // Fetch current gold price from an external API
                const response = await axios.get('https://www.alphavantage.co/query?function=COMMODITY_EXCHANGE_RATE&from_symbol=XAU&to_symbol=USD&apikey=U66KWUAXGI9Y3ZJ');
                setCurrentGoldPrice(response.data.price);
            } catch (error) {
                console.error('Error fetching current gold price:', error);
            }
        };

        fetchGoldPrice();
    }, []);

    useEffect(() => {
        if (currentGoldPrice && investments.length > 0) {
            const calculatedProfits = investments.map(investment => {
                const { amount, goldPriceAtInvestment } = investment;
                const investmentValueAtCurrentPrice = (amount / goldPriceAtInvestment) * currentGoldPrice;
                const profit = investmentValueAtCurrentPrice - amount;
                return { ...investment, profit };
            });
            setProfits(calculatedProfits);
        }
    }, [currentGoldPrice, investments]);

    return (
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Investment Profit</h2>
            {profits.map((investment, index) => (
                <div key={index} className="mb-4">
                    <p>Investment Amount: {investment.amount} USD</p>
                    <p>Gold Price at Investment: {investment.goldPriceAtInvestment} USD per ounce</p>
                    <p>Current Gold Price: {currentGoldPrice} USD per ounce</p>
                    <p className={`${investment.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Profit/Loss: {investment.profit.toFixed(2)} USD
                    </p>
                </div>
            ))}
        </div>
    );
};

export default InvestmentProfit;
