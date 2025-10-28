import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 137, 80001],
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
});

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Connect to injected wallet (like MetaMask)
  const connect = async (connectorType = 'injected') => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const connector = connectorType === 'injected' ? injected : walletconnect;
      await activate(connector, undefined, true);
      
      // After successful connection, you can fetch user data from your backend
      // await fetchUserData();
      
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    try {
      deactivate();
      // Reset user data
      setUserData(null);
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      setError('Failed to disconnect wallet.');
    }
  };

  // Check if user is already connected
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const isAuthorized = await injected.isAuthorized();
      if (isAuthorized) {
        await activate(injected);
      }
    };

    checkIfWalletIsConnected();
  }, [activate]);

  return (
    <WalletContext.Provider
      value={{
        isConnected: active,
        account,
        isConnecting,
        error,
        connect,
        disconnect,
        userData,
        library,
        connector,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;
