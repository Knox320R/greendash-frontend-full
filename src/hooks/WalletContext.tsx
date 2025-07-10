import React, { createContext, useContext, useState, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

interface WalletContextProps {
  walletAddress: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  isConnected: false,
  connectWallet: async () => { },
  disconnectWallet: () => { },
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const providerOptions = {
    injected: {
      display: {
        name: "MetaMask",
        description: "Connect with MetaMask in your browser"
      },
      package: null
    }
  };
  const web3Modal = new Web3Modal({ cacheProvider: false, providerOptions });

  const connectWallet = useCallback(async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setIsConnected(true);

      toast.success('Wallet connected!');
    } catch (err) {
      toast.error('Wallet connection cancelled or failed. do you have a Metamask on this browser?');
      setWalletAddress(null);
      setIsConnected(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setWalletAddress(null);
    setIsConnected(false);
    toast.info('Wallet disconnected.');
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext); 