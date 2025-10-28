const { ApiPromise, WsProvider } = require('@polkadot/api');
const { cryptoWaitReady, mnemonicGenerate } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');

let api = null;

// Initialize Polkadot API
const initPolkadotAPI = async () => {
  if (api) return api;

  try {
    await cryptoWaitReady();
    
    const provider = new WsProvider(process.env.POLKADOT_NETWORK || 'wss://rpc.polkadot.io');
    api = await ApiPromise.create({ 
      provider,
      types: {
        // Add custom types if needed for your chain
      }
    });

    console.log('Connected to Polkadot network:', (await api.rpc.system.chain()).toString());
    return api;
  } catch (error) {
    console.error('Failed to connect to Polkadot network:', error);
    throw new Error('Failed to connect to Polkadot network');
  }
};

// Generate a new mnemonic
const generateMnemonic = () => {
  return mnemonicGenerate();
};

// Create a new account from mnemonic
const createAccount = (mnemonic) => {
  try {
    const keyring = new Keyring({ type: 'sr25519' });
    const account = keyring.addFromMnemonic(mnemonic);
    return {
      address: account.address,
      mnemonic,
      publicKey: account.publicKey.toString(),
    };
  } catch (error) {
    console.error('Error creating account:', error);
    throw new Error('Failed to create account');
  }
};

// Get account balance
const getBalance = async (address) => {
  try {
    const api = await initPolkadotAPI();
    const { data: balance } = await api.query.system.account(address);
    return {
      free: balance.free.toString(),
      reserved: balance.reserved.toString(),
      total: balance.free.add(balance.reserved).toString(),
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to fetch account balance');
  }
};

// Verify signature
const verifySignature = (message, signature, address) => {
  try {
    const keyring = new Keyring();
    const publicKey = keyring.decodeAddress(address);
    const messageU8a = isHex(message) ? hexToU8a(message) : new TextEncoder().encode(message);
    const signatureU8a = isHex(signature) ? hexToU8a(signature) : signature;
    
    return keyring.verifyMessage(messageU8a, signatureU8a, publicKey);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

module.exports = {
  initPolkadotAPI,
  generateMnemonic,
  createAccount,
  getBalance,
  verifySignature,
  getApi: () => api,
};
