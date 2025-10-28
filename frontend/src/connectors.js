import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 137, 80001], // Add your supported chain IDs
});

// Add other connectors if needed (WalletConnect, WalletLink, etc.)
// export const walletconnect = new WalletConnectConnector({
//   rpc: {
//     1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
//   },
//   bridge: 'https://bridge.walletconnect.org',
//   qrcode: true,
//   pollingInterval: 12000,
// });

export default {
  injected,
  // walletconnect,
};
