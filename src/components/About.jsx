// About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaDollarSign, FaExchangeAlt, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

const About = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-r bg-gray-900 text-white p-6">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <motion.h1
                    className="text-5xl font-bold mb-4"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    transition={{ duration: 0.5 }}
                >
                    About MobiCurrency
                </motion.h1>
                <motion.p
                    className="text-lg max-w-2xl mx-auto mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    MobiCurrency is your ultimate platform for seamless and secure online currency exchange. Our user-friendly interface and real-time rates empower you to make informed decisions, whether you're traveling or sending money abroad.
                </motion.p>
                <motion.button
                    className="bg-yellow-400 text-gray-900 px-4 py-2 rounded shadow-lg hover:bg-yellow-300 transition duration-300"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Learn More
                </motion.button>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                    {
                        icon: <FaDollarSign className="text-4xl mb-2" />,
                        title: 'Real-Time Rates',
                        description: 'Stay updated with the latest exchange rates for informed trading.',
                    },
                    {
                        icon: <FaExchangeAlt className="text-4xl mb-2" />,
                        title: 'Easy Exchange',
                        description: 'Exchange currencies effortlessly with just a few clicks.',
                    },
                    {
                        icon: <FaShieldAlt className="text-4xl mb-2" />,
                        title: 'Secure Transactions',
                        description: 'Your transactions are safe with our advanced encryption technologies.',
                    },
                    {
                        icon: <FaMobileAlt className="text-4xl mb-2" />,
                        title: 'Mobile Access',
                        description: 'Access our services anytime, anywhere from your mobile device.',
                    },
                ].map((feature, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-yellow-400 hover:text-gray-900"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                        {feature.icon}
                        <h3 className="text-xl font-semibold mt-2">{feature.title}</h3>
                        <p className="text-center text-sm mt-1">{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Testimonials Section */}
            <div className="text-center">
                <motion.h2
                    className="text-3xl font-bold mb-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    transition={{ duration: 0.5 }}
                >
                    What Our Users Say
                </motion.h2>
                <div className="flex flex-col items-center">
                    {[
                        {
                            quote: "MobiCurrency made my trip so much easier! The rates are fantastic.",
                            name: "John Doe",
                        },
                        {
                            quote: "I love how simple the exchange process is. Highly recommend!",
                            name: "Jane Smith",
                        },
                    ].map((testimonial, index) => (
                        <motion.blockquote
                            key={index}
                            className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 max-w-md transition-transform transform hover:scale-105 hover:bg-yellow-400 hover:text-gray-900"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
                        >
                            <p className="italic">"{testimonial.quote}"</p>
                            <footer className="mt-2 font-semibold">- {testimonial.name}</footer>
                        </motion.blockquote>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
