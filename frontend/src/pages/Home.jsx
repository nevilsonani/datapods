import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const Home = () => {
  const { connect, isConnected, account, isConnecting } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await connect();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Take Control of Your Data
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Securely store, manage, and control access to your personal data with blockchain technology.
          </p>
          
          <div className="mt-10 flex justify-center">
            {isConnected ? (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-700">Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors duration-150"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center">How It Works</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {[
              {
                title: 'Store Securely',
                description: 'Your data is encrypted and stored on IPFS, ensuring security and immutability.',
                icon: '🔒',
              },
              {
                title: 'Control Access',
                description: 'Grant or revoke access to your data with blockchain-based permissions.',
                icon: '🔑',
              },
              {
                title: 'Track Everything',
                description: 'Monitor all access requests and data usage in real-time.',
                icon: '📊',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
