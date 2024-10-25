// Contact.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <motion.h1
                className="text-4xl font-bold text-yellow-400 mb-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                transition={{ duration: 0.5 }}
            >
                Contact Us
            </motion.h1>
            <motion.form
                className="flex flex-col space-y-4 mb-6 max-w-md w-full"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <input
                    type="text"
                    placeholder="Your Name"
                    className="p-2 rounded bg-gray-800 placeholder-gray-500"
                    required
                />
                <input
                    type="email"
                    placeholder="Your Email"
                    className="p-2 rounded bg-gray-800 placeholder-gray-500"
                    required
                />
                <textarea
                    placeholder="Your Message"
                    className="p-2 rounded bg-gray-800 placeholder-gray-500"
                    rows="4"
                    required
                />
                <button
                    type="submit"
                    className="bg-yellow-400 text-gray-900 p-2 rounded hover:bg-yellow-300 transition duration-300"
                >
                    Send Message
                </button>
            </motion.form>
            <div className="flex space-x-8 mb-6">
                <div className="flex flex-col items-center">
                    <FaEnvelope className="text-yellow-400 text-4xl mb-2" />
                    <span>Email</span>
                </div>
                <div className="flex flex-col items-center">
                    <FaPhoneAlt className="text-yellow-400 text-4xl mb-2" />
                    <span>Phone</span>
                </div>
                <div className="flex flex-col items-center">
                    <FaMapMarkerAlt className="text-yellow-400 text-4xl mb-2" />
                    <span>Location</span>
                </div>
            </div>
        </div>
    );
};

export default Contact;
