import React from 'react';
import { useWallet } from '@/hooks/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaWallet, FaCheckCircle, FaTimes, FaExclamationTriangle, FaPlug } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface WalletConfirmationProps {
  expectedAddress: string;
  title?: string;
  description?: string;
  showDetails?: boolean;
}

const WalletConfirmation: React.FC<WalletConfirmationProps> = ({
  expectedAddress,
  title = "Connect to Platform Wallet",
  description = "Please connect your wallet to the platform address",
  showDetails = true
}) => {
  const { walletAddress, isConnected, isCorrectWallet, confirmWalletAddress, connectWallet } = useWallet();
  
  const isCorrect = isCorrectWallet(expectedAddress);
  const truncatedExpected = `${expectedAddress.slice(0, 6)}...${expectedAddress.slice(-4)}`;
  const truncatedConnected = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';

  const handleConnect = async () => {
    if (!isConnected) {
      await connectWallet();
    } else if (!isCorrect) {
      toast.info('Please switch to the correct wallet in MetaMask and try again.');
    } else {
      confirmWalletAddress(expectedAddress);
    }
  };

  let buttonText = 'Connect Wallet';
  let buttonIcon = <FaPlug className="w-4 h-4 mr-2" />;
  let buttonColor = 'bg-blue-600 hover:bg-blue-700';
  if (isConnected && !isCorrect) {
    buttonText = 'Wrong Wallet';
    buttonIcon = <FaTimes className="w-4 h-4 mr-2" />;
    buttonColor = 'bg-red-600 hover:bg-red-700';
  } else if (isConnected && isCorrect) {
    buttonText = 'Wallet Connected';
    buttonIcon = <FaCheckCircle className="w-4 h-4 mr-2" />;
    buttonColor = 'bg-green-600 hover:bg-green-700';
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FaWallet className="text-blue-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection Status:</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </div>

        {/* Expected Address */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Expected Address:</span>
          <div className="bg-gray-50 p-2 rounded border font-mono text-sm">
            {truncatedExpected}
          </div>
        </div>

        {/* Connected Address */}
        {isConnected && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Connected Address:</span>
            <div className={`p-2 rounded border font-mono text-sm ${
              isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              {truncatedConnected}
            </div>
          </div>
        )}

        {/* Validation Status */}
        {isConnected && (
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm text-green-700">Address matches correctly</span>
              </>
            ) : (
              <>
                <FaExclamationTriangle className="text-red-500" />
                <span className="text-sm text-red-700">Address does not match</span>
              </>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleConnect}
            className={`flex-1 ${buttonColor}`}
          >
            {buttonIcon}
            {buttonText}
          </Button>
        </div>

        {/* Detailed Address (if showDetails is true) */}
        {showDetails && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Show Full Addresses
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-xs text-gray-500">Expected:</span>
                <div className="font-mono text-xs bg-gray-50 p-1 rounded">
                  {expectedAddress}
                </div>
              </div>
              {walletAddress && (
                <div>
                  <span className="text-xs text-gray-500">Connected:</span>
                  <div className="font-mono text-xs bg-gray-50 p-1 rounded">
                    {walletAddress}
                  </div>
                </div>
              )}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConfirmation; 