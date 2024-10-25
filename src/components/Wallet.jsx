import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import firebaseApp from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { FaWallet, FaEye, FaDollarSign, FaEuroSign, FaPoundSign, FaYenSign, FaRupeeSign, FaLock, FaTimes } from 'react-icons/fa';

const Wallet = () => {
    const [walletData, setWalletData] = useState([]);
    const [showAmount, setShowAmount] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [code, setCode] = useState('');
    const correctCode = '1234';

    const db = getDatabase(firebaseApp);
    const auth = getAuth(firebaseApp);

    useEffect(() => {
        const fetchWalletData = async () => {
            const user = "akshat"; // Replace with auth.currentUser
            if (!user) return;
        
            const purchasesRef = ref(db, `purchases/${user}`); // Ensure you're using the correct user reference
            try {
                const snapshot = await get(purchasesRef);
                if (snapshot.exists()) {
                    const purchases = snapshot.val();
                    const currencyBalances = {};
        
                    // Aggregate totalCost per currency
                    Object.values(purchases).forEach(purchase => {
                        const { currencyPair, totalCost } = purchase; // Change 'amount' to 'totalCost'
                        const currency = currencyPair.split('-')[0]; // e.g., "INR" from "INR-USD"
        
                        // Ensure totalCost is valid
                        const parsedCost = parseFloat(totalCost);
                        if (!isNaN(parsedCost)) {
                            currencyBalances[currency] = (currencyBalances[currency] || 0) + parsedCost;
                        }
                    });
        
                    // Format data for display
                    const formattedData = Object.keys(currencyBalances).map((currency, index) => ({
                        id: index + 1,
                        currency,
                        amount: currencyBalances[currency],
                    }));
                    setWalletData(formattedData);
                }
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            }
        };

        fetchWalletData();
    }, ["akshat"/* auth.currentUser */]);

    const openModal = (currencyId) => {
        setSelectedCurrency(currencyId);
        setIsModalOpen(true);
    };

    const handleCheckBalance = () => {
        if (code === correctCode) {
            setShowAmount((prev) => ({ ...prev, [selectedCurrency]: true })); // Show amount for the selected currency
            setIsModalOpen(false); // Close the modal
            setCode(''); // Clear the input code
        } else {
            alert('Incorrect code, please try again.'); // Optionally alert the user
            setCode(''); // Clear the input for a new attempt
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 p-6">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">
                <FaWallet className="inline-block mr-2" />
                My Wallet
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {walletData.map(item => {
                    let currencyIcon;
                    switch (item.currency) {
                        case 'USD': currencyIcon = <FaDollarSign className="text-yellow-400" />; break;
                        case 'EUR': currencyIcon = <FaEuroSign className="text-yellow-400" />; break;
                        case 'GBP': currencyIcon = <FaPoundSign className="text-yellow-400" />; break;
                        case 'JPY': currencyIcon = <FaYenSign className="text-yellow-400" />; break;
                        case 'INR': currencyIcon = <FaRupeeSign className="text-yellow-400" />; break;
                        default: currencyIcon = null;
                    }

                    return (
                        <div key={item.id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-yellow-400 flex items-center">
                                {currencyIcon} <span className="ml-2">{item.currency}</span>
                                <span className="ml-2 cursor-pointer" onClick={() => openModal(item.id)}>
                                    <FaEye />
                                </span>
                            </h2>
                            <p className="text-gray-300">
                                Amount: {showAmount[item.id] ? item.amount : '*****'}
                            </p>
                        </div>
                    );
                })}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                            <FaLock className="inline-block mr-2" />
                            Enter Password
                        </h3>
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-2 mb-4 bg-gray-600 text-gray-300 rounded"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleCheckBalance}
                                className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition"
                            >
                                Check Balance
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md ml-2 hover:bg-red-600 transition"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center h-screen">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
                    <button className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition" onClick={() => { location.href = '/invest' }}>
                        INVEST
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
