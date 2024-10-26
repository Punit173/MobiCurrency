import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, push } from 'firebase/database';
import firebaseApp from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { FaDollarSign, FaRupeeSign, FaCheckCircle, FaMoneyBillAlt } from 'react-icons/fa';

const Payment = () => {
    const location = useLocation();
    const { selectedCurrencyPair, currentPrice } = location.state || {};

    const [amount, setAmount] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const db = getDatabase(firebaseApp);
    const auth = getAuth(firebaseApp);

    // Handle error if currency data is not available
    if (!selectedCurrencyPair || !currentPrice) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>Error: Currency data is unavailable. Please navigate from the Exchange page.</p>
            </div>
        );
    }

    // Handle changes in amount input
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        if (!isNaN(value) && value > 0) {
            setTotalCost(value * currentPrice);
            setErrorMessage('');
        } else {
            setTotalCost(0);
            setErrorMessage('Please enter a valid amount.');
        }
    };

    // Handle purchase logic
    const handlePurchase = async () => {
        const user = { uid: "akshat" }; // Use temporary user if no authenticated user
        if (user) {
            const purchaseDate = new Date().toLocaleDateString();
            const newPurchaseRef = push(ref(db, `purchases/${user.uid}`));

            try {
                await set(newPurchaseRef, {
                    currencyPair: selectedCurrencyPair,
                    amount,
                    pricePerUnit: currentPrice,
                    totalCost,
                    purchaseDate,
                });

                alert('Purchase successfully saved!');
                setSuccessMessage(true);
                navigate('/wallet');

                // Hide success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(false);
                }, 5000);
            } catch (error) {
                console.error('Error saving purchase data to Firebase:', error);
                setErrorMessage('Error saving purchase. Please try again.');
            }
        } else {
            alert('User is not logged in.');
        }
    };

    // Format the total cost based on the currency pair
    const formatCurrency = (value) => {
        return value.toFixed(2);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-yellow-400 text-center mb-6">
                    <FaMoneyBillAlt className="mr-2 inline" />
                    Purchase {selectedCurrencyPair.replace('-', ' to ')}
                </h1>

                <p className="text-lg mb-4">
                    Current Price: 
                    {selectedCurrencyPair.startsWith('INR') ? (
                        <FaRupeeSign className="ml-1 inline" />
                    ) : (
                        <FaDollarSign className="ml-1 inline" />
                    )}
                    {formatCurrency(currentPrice)}
                </p>

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-yellow-400 mb-2">
                        Amount to Buy:
                    </label>
                    <input
                        type="number"
                        id="amount"
                        className={`w-full p-2 bg-gray-700 text-white rounded-lg outline-none ${errorMessage ? 'border border-red-500' : ''}`}
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                    />
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>

                <p className="text-lg mb-6">
                    Total Cost: 
                    {totalCost > 0 && (selectedCurrencyPair.startsWith('INR') ? (
                        <FaRupeeSign className="ml-1 inline" />
                    ) : (
                        <FaDollarSign className="ml-1 inline" />
                    ))}
                    <span className="font-semibold">{formatCurrency(totalCost)}</span>
                </p>

                <button
                    className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-700 text-white font-semibold"
                    onClick={handlePurchase}
                    disabled={totalCost <= 0} // Disable button if total cost is 0 or less
                >
                    <FaCheckCircle className="mr-2 inline" />
                    Confirm Purchase
                </button>

                {successMessage && (
                    <div className="mt-6 p-4 bg-green-600 text-center rounded-lg text-white font-semibold">
                        <FaCheckCircle className="mr-2 inline" />
                        Payment successful! You can collect cash from the airport.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
