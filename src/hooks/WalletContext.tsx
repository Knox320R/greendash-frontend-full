import React, { createContext, useContext, useState, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

interface WalletContextProps {
  walletAddress: string | null;
  isConnected: boolean;
  connectWallet: (expectedAddress?: string) => Promise<void>;
  disconnectWallet: () => void;
  confirmWalletAddress: (expectedAddress: string) => boolean;
  isCorrectWallet: (expectedAddress: string) => boolean;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  isConnected: false,
  connectWallet: async (_?: string) => { },
  disconnectWallet: () => { },
  confirmWalletAddress: () => false,
  isCorrectWallet: () => false,
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

  const connectWallet = useCallback(async (expectedAddress?: string) => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setIsConnected(true);

      if (expectedAddress && address.toLowerCase() !== expectedAddress.toLowerCase()) {
        toast.error(`Connected wallet does not match your registered address: ${expectedAddress.slice(0, 6)}...${expectedAddress.slice(-4)}`);
        // Optionally disconnect immediately:
        // setWalletAddress(null);
        // setIsConnected(false);
      } else {
        toast.success('Wallet connected!');
      }
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

  const isCorrectWallet = useCallback((expectedAddress: string) => {
    if (!walletAddress || !isConnected) return false;
    return walletAddress.toLowerCase() === expectedAddress.toLowerCase();
  }, [walletAddress, isConnected]);

  const confirmWalletAddress = useCallback((expectedAddress: string) => {
    const isCorrect = isCorrectWallet(expectedAddress);
    if (!isCorrect) {
      toast.error(`Please connect the correct wallet address: ${expectedAddress.slice(0, 6)}...${expectedAddress.slice(-4)}`);
    } else {
      toast.success('Correct wallet address confirmed!');
    }
    return isCorrect;
  }, [isCorrectWallet]);

  return (
    <WalletContext.Provider value={{ 
      walletAddress, 
      isConnected, 
      connectWallet, 
      disconnectWallet, 
      confirmWalletAddress, 
      isCorrectWallet 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext); 