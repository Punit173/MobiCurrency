import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWallet, FaPlusCircle, FaHistory, FaEye, FaLock, FaTimes } from 'react-icons/fa';

const Wallet = () => {
    const [walletData, setWalletData] = useState([
        { id: 1, currency: 'USD', amount: 5000, date: '2024-10-25', exchangeRate: 83.0 },
        { id: 2, currency: 'EUR', amount: 3000, date: '2024-10-20', exchangeRate: 90.0 },
        { id: 3, currency: 'GBP', amount: 2000, date: '2024-10-15', exchangeRate: 102.0 },
        { id: 4, currency: 'JPY', amount: 150000, date: '2024-10-10', exchangeRate: 0.6 },
        { id: 5, currency: 'INR', amount: 100000, date: '2024-10-05', exchangeRate: 1 },
    ]);

    const [code, setCode] = useState('');
    const [showAmount, setShowAmount] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [newAmount, setNewAmount] = useState(0);
    const [newCurrency, setNewCurrency] = useState('');
    const [transactionHistory, setTransactionHistory] = useState([]);
    const correctCode = '1234';

    const handleDownload = () => {
        const dataStr = JSON.stringify(walletData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wallet_data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCheckBalance = () => {
        if (code === correctCode) {
            setShowAmount(prev => ({ ...prev, [selectedCurrency]: true }));
            setIsModalOpen(false);
        } else {
            toast.error('Incorrect code. Please try again.');
        }
        setCode('');
    };

    const openModal = (currencyId) => {
        setSelectedCurrency(currencyId);
        setIsModalOpen(true);
    };

    const handleAddMoney = () => {
        if (!newCurrency || newAmount <= 0) {
            toast.error('Please enter a valid currency and amount.');
            return;
        }

        const existingCurrency = walletData.find(item => item.currency === newCurrency);
        const date = new Date().toISOString().split('T')[0];

        if (existingCurrency) {
            const updatedWalletData = walletData.map(item =>
                item.currency === newCurrency ? { ...item, amount: item.amount + newAmount } : item
            );

            setWalletData(updatedWalletData);
        } else {
            const newCurrencyData = {
                id: walletData.length + 1,
                currency: newCurrency,
                amount: newAmount,
                date,
                exchangeRate: 1,
            };
            setWalletData([...walletData, newCurrencyData]);
        }

        setTransactionHistory(prev => [
            ...prev,
            { currency: newCurrency, amount: newAmount, date },
        ]);

        setNewAmount(0);
        setNewCurrency('');
        toast.success('Money added successfully!');
    };

    const totalWorthInINR = walletData.reduce((total, item) => total + (item.amount * item.exchangeRate), 0);

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 p-6">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">
                <FaWallet className="inline-block mr-2" />
                My Wallet
            </h1>

            <div className="mb-6 text-center">
                <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition"
                >
                    Download Wallet Data
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-yellow-400 text-center">
                    Total Worth in INR: ₹{totalWorthInINR.toFixed(2)}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {walletData.map(item => (
                    <div key={item.id} className="bg-gray-700 p-4 rounded-lg shadow-lg transition transform hover:scale-105">
                        <h2 className="text-xl font-semibold text-yellow-400 flex items-center">
                            {item.currency} 
                            <span className="ml-2 cursor-pointer" onClick={() => openModal(item.id)}>
                                <FaEye />
                            </span>
                        </h2>
                        <p className="text-gray-300">
                            Amount: {showAmount[item.id] ? item.amount : '*****'}
                        </p>
                        <p className="text-gray-300">{item.date}</p>
                    </div>
                ))}
            </div>

            

            <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-yellow-400">
                    <FaHistory className="inline-block mr-2" />
                    Transaction History
                </h2>
                <ul className="mt-2">
                    {transactionHistory.length > 0 ? (
                        transactionHistory.map((transaction, index) => (
                            <li key={index} className="text-gray-300">
                                {transaction.date}: Added {transaction.amount} {transaction.currency}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-400">No transactions yet.</li>
                    )}
                </ul>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                            <FaLock className="inline-block mr-2" />
                            Enter Password
                        </h3>
                        <input
                            type="text"
                            placeholder="Enter code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="border border-gray-500 p-2 rounded-md w-full"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleCheckBalance}
                                className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="ml-2 px-4 py-2 bg-red-500 text-gray-900 font-semibold rounded-md hover:bg-red-600 transition"
                            >
                                <FaTimes className="inline-block mr-2" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Wallet;
