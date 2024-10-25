import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, set, push } from 'firebase/database';
import firebaseApp from '../firebase/firebase';
import { getAuth } from 'firebase/auth';

const Payment = () => {
    const location = useLocation();
    const { selectedCurrencyPair, currentPrice } = location.state || {};

    const [amount, setAmount] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [successMessage, setSuccessMessage] = useState(false); // New state for success message

    const db = getDatabase(firebaseApp);
    const auth = getAuth(firebaseApp);

    if (!selectedCurrencyPair || !currentPrice) {
        return <div>Error: Currency data is unavailable. Please navigate from the Exchange page.</div>;
    }

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        setTotalCost(value * currentPrice);
    };

    const handlePurchase = async () => {
        const user = "akshat";/* auth.currentUser */;
        if (user) {
            const purchaseDate = new Date().toLocaleDateString();
            const newPurchaseRef = push(ref(db, `purchases/${user/* .uid */}`));

            try {
                await set(newPurchaseRef, {
                    currencyPair: selectedCurrencyPair,
                    amount,
                    pricePerUnit: currentPrice,
                    totalCost,
                    purchaseDate,
                });
              
                alert('Purchase successfully saved!');
                setSuccessMessage(true); // Show success message

                // Hide success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(false);
                }, 5000);
            } catch (error) {
                console.error('Error saving purchase data to Firebase:', error);
            }
        } else {
            alert('User is not logged in.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-yellow-400 text-center mb-6">
                    Purchase {selectedCurrencyPair.replace('-', ' to ')}
                </h1>

                <p className="text-lg mb-4">Current Price: ${currentPrice}</p>

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-yellow-400 mb-2">
                        Amount to Buy:
                    </label>
                    <input
                        type="number"
                        id="amount"
                        className="w-full p-2 bg-gray-700 text-white rounded-lg outline-none"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                    />
                </div>

                <p className="text-lg mb-6">
                    Total Cost: <span className="font-semibold">${totalCost.toFixed(2)}</span>
                </p>

                <button
                    className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-700 text-white font-semibold"
                    onClick={handlePurchase}
                >
                    Confirm Purchase
                </button>

                {successMessage && (
                    <div className="mt-6 p-4 bg-green-600 text-center rounded-lg text-white font-semibold">
                        Payment successful! You can collect cash from the airport.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
