import React from 'react';

const About = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold text-yellow-400 mb-6">
                About MobiCurrency
            </h1>
            <div className='flex content-center items-center'>
                <div>
                    <p className="text-lg mb-6 text-center">
                        MobiCurrency is your go-to platform for online currency exchange. We provide real-time rates, secure transactions, and a user-friendly interface to make your currency exchange experience smooth and efficient. Whether you're traveling abroad or making international payments, MobiCurrency is here to help.
                    </p>

                    <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                        Our Features
                    </h2>
                    <div className="flex flex-col items-center space-y-4 mb-6">
                        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-yellow-400 text-xl mb-2">Real-Time Rates</h3>
                            <p className="text-center text-sm">
                                Access the latest currency rates from global markets to make informed decisions.
                            </p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-green-400 text-xl mb-2">Easy Exchange</h3>
                            <p className="text-center text-sm">
                                Seamlessly exchange currencies with just a few clicks, anytime and anywhere.
                            </p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-blue-400 text-xl mb-2">Secure Transactions</h3>
                            <p className="text-center text-sm">
                                Your security is our priority. We use advanced encryption to keep your transactions safe.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                        Our Mission
                    </h2>
                    <p className="text-lg mb-6 text-center">
                        At MobiCurrency, our mission is to provide accessible and affordable currency exchange solutions for everyone. We strive to empower users with the knowledge and tools they need to navigate the complexities of foreign exchange confidently.
                    </p>

                    <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                        Join Our Community
                    </h2>
                    <div className="flex flex-col items-center space-y-4 mb-6">
                        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg w-80">
                            <h3 className="text-purple-400 text-xl mb-2">Community Support</h3>
                            <p className="text-center text-sm">
                                Join a community of like-minded individuals who share tips and insights on currency exchange.
                            </p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg w-80">
                            <h3 className="text-pink-400 text-xl mb-2">Customer Feedback</h3>
                            <p className="text-center text-sm">
                                We value your input. Share your experiences and help us improve our services.
                            </p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg w-80">
                            <h3 className="text-teal-400 text-xl mb-2">Mobile Access</h3>
                            <p className="text-center text-sm">
                                Access MobiCurrency from your mobile device for currency exchange on the go.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
