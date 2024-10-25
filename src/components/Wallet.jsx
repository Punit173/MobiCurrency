import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWallet, FaPlusCircle, FaHistory, FaEye, FaLock, FaTimes, FaDollarSign, FaEuroSign, FaPoundSign, FaYenSign, FaRupeeSign, FaCanadianMapleLeaf, FaAsterisk } from 'react-icons/fa';

const Wallet = () => {
    const [walletData, setWalletData] = useState([
        { id: 1, currency: 'USD', amount: 5000, date: '2024-10-25', exchangeRate: 83.0 },
        { id: 2, currency: 'EUR', amount: 3000, date: '2024-10-20', exchangeRate: 90.0 },
        { id: 3, currency: 'GBP', amount: 2000, date: '2024-10-15', exchangeRate: 102.0 },
        { id: 4, currency: 'JPY', amount: 150000, date: '2024-10-10', exchangeRate: 0.6 },
        { id: 5, currency: 'INR', amount: 100000, date: '2024-10-05', exchangeRate: 1 },
        { id: 6, currency: 'CAD', amount: 4000, date: '2024-10-25', exchangeRate: 60.0 }, // Canadian Dollar
        { id: 7, currency: 'AUD', amount: 3500, date: '2024-10-20', exchangeRate: 55.0 }, // Australian Dollar
        { id: 8, currency: 'CHF', amount: 2500, date: '2024-10-15', exchangeRate: 95.0 }, // Swiss Franc
        { id: 9, currency: 'CNY', amount: 20000, date: '2024-10-10', exchangeRate: 12.0 }, // Chinese Yuan
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {walletData.map(item => {
                    let currencyIcon;
                    switch (item.currency) {
                        case 'USD':
                            currencyIcon = <FaDollarSign className="text-yellow-400" />;
                            break;
                        case 'EUR':
                            currencyIcon = <FaEuroSign className="text-yellow-400" />;
                            break;
                        case 'GBP':
                            currencyIcon = <FaPoundSign className="text-yellow-400" />;
                            break;
                        case 'JPY':
                            currencyIcon = <FaYenSign className="text-yellow-400" />;
                            break;
                        case 'INR':
                            currencyIcon = <FaRupeeSign className="text-yellow-400" />;
                            break;
                        case 'CAD':
                            currencyIcon = <FaCanadianMapleLeaf className="text-yellow-400" />; // Canadian Dollar
                            break;
                        case 'AUD':
                            currencyIcon = <FaAsterisk className="text-yellow-400" />; // Australian Dollar
                            break;
                        case 'CHF':
                            currencyIcon = <FaAsterisk className="text-yellow-400" />; // Swiss Franc
                            break;
                        case 'CNY':
                            currencyIcon = <FaAsterisk className="text-yellow-400" />; // Chinese Yuan
                            break;
                        default:
                            currencyIcon = null;
                    }

                    return (
                        <div key={item.id} className="bg-gray-700 p-4 rounded-lg shadow-lg transition transform hover:scale-105">
                            <h2 className="text-xl font-semibold text-yellow-400 flex items-center">
                                {currencyIcon}
                                <span className="ml-2">{item.currency}</span>
                                <span className="ml-2 cursor-pointer" onClick={() => openModal(item.id)}>
                                    <FaEye />
                                </span>
                            </h2>
                            <p className="text-gray-300">
                                Amount: {showAmount[item.id] ? item.amount : '*****'}
                            </p>
                            <p className="text-gray-300">{item.date}</p>
                        </div>
                    );
                })}
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
        </div>
    );
};

export default Wallet;
