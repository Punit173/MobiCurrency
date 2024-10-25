import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">

{/* Background video */}
<video
    className="absolute top-0 left-0 w-full h-full object-cover z-0" // Set z-index to 0
    autoPlay
    muted
    loop
>
    <source src="/homevideo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>


            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center h-screen bg-cover bg-center relative text-center overflow-hidden" >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-4 animate-fadeInUp">
                        Welcome to Currency Exchange Hub
                    </h1>
                    <p className="text-lg sm:text-xl max-w-2xl mx-auto px-4 mb-8 animate-fadeIn delay-200">
                        Your one-stop platform for live exchange rates, currency forecasting, and seamless transactions. Make smart financial decisions with ease!
                    </p>
                    <button
                        onClick={() => navigate('/exchange')}
                        className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition transform hover:scale-105 animate-fadeIn delay-500">
                        Get Started
                    </button>
                </div>
            </section>

            <section className="mt-16 sm:mt-24 px-6 sm:px-12 md:px-24">
                <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 text-center mb-8 animate-fadeInUp">
                    Explore Our Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Live Exchange Rates"
                        description="View and analyze real-time exchange rates for multiple currency pairs, ensuring you have the most accurate and up-to-date information for your transactions."
                        icon="💱"
                        onClick={() => navigate('/')}
                    />
                    <FeatureCard
                        title="Currency Forecasting"
                        description="Access future currency trends based on historical data and market insights, helping you to make informed decisions with predictive analytics."
                        icon="📈"
                        onClick={() => navigate('/forecast')}
                    />
                    <FeatureCard
                        title="Currency Pre-Booking"
                        description="Secure your currency at today’s rate for future transactions, protecting your money from market volatility and making budgeting easier."
                        icon="🕒"
                        onClick={() => navigate('/prebooking')}
                    />
                    <FeatureCard
                        title="Instant Exchange"
                        description="Make quick currency exchanges with a user-friendly payment process and seamless experience, allowing you to act fast when the rates are in your favor."
                        icon="💸"
                        onClick={() => navigate('/exchange')}
                    />
                    <FeatureCard
                        title="Transaction History"
                        description="Track your previous transactions, monitor exchange patterns, and generate reports for a better understanding of your financial activities."
                        icon="📊"
                        onClick={() => navigate('/history')}
                    />
                    <FeatureCard
                        title="E-Wallet"
                        description="A digital wallet where you can store, manage, and exchange multiple currencies effortlessly, giving you flexibility and control over your funds anytime, anywhere."
                        icon="💼"
                        onClick={() => navigate('/ewallet')}
                    />
                </div>
            </section>

            <section className="mt-16 sm:mt-24 px-6 sm:px-12 md:px-24">
                <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 text-center mb-8 animate-fadeInUp">
                    What Our Users Say
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 content-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 align-centre">
                            <TestimonialCard
                                name="Emily R."
                                feedback={["Currency Exchange Hub made it so easy for me to plan my trip without worrying about currency fluctuations. Highly recommend!"]}
                            />
                            <TestimonialCard
                                name="John D."
                                feedback={["The currency forecasting tool helped me secure a better rate and save a lot of money. I feel much more in control of my finances."]}
                            />
                            <TestimonialCard
                                name="Sophia L."
                                feedback={["Absolutely love the pre-booking feature! Knowing my rates in advance gave me peace of mind while traveling."]}
                            />
                            <TestimonialCard
                                name="Michael T."
                                feedback={["The interface is user-friendly, making it a breeze to compare exchange rates. A great tool for travelers!"]}
                            />
                            <TestimonialCard
                                name="Lisa M."
                                feedback={["I was able to lock in a fantastic rate before my trip. This service is a game changer!"]}
                            />
                            <TestimonialCard
                                name="David K."
                                feedback={["The customer service was top-notch! They helped me with all my queries promptly. Highly satisfied."]}
                            />
                            <TestimonialCard
                                name="Emma S."
                                feedback={["I love the pre-booking feature! It gave me the confidence I needed for my business trip."]}
                            />
                            <TestimonialCard
                                name="Oliver J."
                                feedback={["The alerts for rate changes are super helpful! I never miss out on a good deal."]}
                            />
                            <TestimonialCard
                                name="Isabella N."
                                feedback={["Using this platform has made my travel planning so much easier. Highly recommended to all travelers!"]}
                            />

                        </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        <img
                            src="https://i.pinimg.com/originals/02/e1/41/02e14146471323dc0920630f863a7966.gif"
                            alt="Currency Exchange"
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </div>
            </section>

            <section className="mt-16 sm:mt-24 px-6 sm:px-12 md:px-24">
                <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 text-center mb-8 animate-fadeInUp">
                    Our Achievements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                    <StatisticCard title="Users" endValue={2375} />
                    <StatisticCard title="Currencies Exchanged" endValue={100000} />
                    <StatisticCard title="Countries Supported" endValue={150} />
                </div>
            </section>

            <footer className="bg-gray-800 py-8 mt-16">
                <div className="text-center text-gray-400">
                    <p className="mb-1"></p>
                    <p>Contact us at <a href="mailto:support@currencyhub.com" className="text-yellow-400 underline">support@currencyhub.com</a></p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ title, description, icon, onClick }) => (
    <div
        className="relative bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600 transition cursor-pointer transform hover:-translate-y-1 hover:scale-105"
        onClick={onClick}
    >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 text-4xl">{icon}</div>
        <h3 className="text-xl font-semibold text-yellow-400 mb-2 flex items-center space-x-2">
            <span>{icon}</span> <span>{title}</span>
        </h3>
        <p className="text-gray-300">{description}</p>
    </div>
);

const TestimonialCard = ({ name, feedback }) => (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:bg-gray-600 transition">
        <TypeAnimation
            sequence={feedback.concat([1000])}
            speed={50}
            className="text-gray-300 italic mb-4"
            repeat={Infinity}
        />
        <h4 className="text-yellow-400 font-semibold">- {name}</h4>
    </div>
);

const StatisticCard = ({ title, endValue }) => (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600 transition">
        <h3 className="text-4xl font-bold text-yellow-400 mb-2">
            <CountUp start={0} end={endValue} duration={3} separator="," />+
        </h3>
        <p className="text-gray-300">{title}</p>
    </div>
);

export default Home;
