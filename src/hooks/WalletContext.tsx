import React, { createContext, useContext, useState, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

interface WalletContextProps {
  walletAddress: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  isConnected: false,
  connectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = useCallback(async () => {
    try {
      const web3Modal = new Web3Modal({ cacheProvider: false, providerOptions: {} });
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setIsConnected(true);
      toast.success('Wallet connected!');
    } catch (err) {
      toast.error('Wallet connection cancelled or failed.');
    }
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, isConnected, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext); 