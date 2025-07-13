import { Withdrawal } from '@/types/auth-1';
import React from 'react';

interface NotificationBannerProps {
    notes: Withdrawal[];
    onClose: () => void;
    onWithdrawal: (id: number) => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notes, onClose, onWithdrawal }) => (
    <div className="fixed top-20 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 px-4 py-3">
        <div className="max-w-4xl mx-auto">
            {notes.map(item => (
                <div key={item.id} className="mb-3">
                    <div className={`bg-white border-l-4 shadow-2xl rounded-lg border ${
                        item.status === "approved" 
                            ? "border-green-500 shadow-green-100" 
                            : "border-blue-500 shadow-blue-100"
                    }`}>
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {/* Status Icon */}
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                        item.status === "approved" 
                                            ? "bg-green-500 text-white" 
                                            : "bg-blue-500 text-white"
                                    }`}>
                                        {item.status === "approved" ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className={`text-base font-semibold ${
                                            item.status === "approved" 
                                                ? "text-green-700" 
                                                : "text-blue-700"
                                        }`}>
                                            {item.status === "approved"
                                                ? `Withdrawal approved: ${item.amount} USDT`
                                                : `Withdrawal returned: ${item.amount} USDT`
                                            }
                                        </div>
                                        <div className="text-sm text-gray-700 mt-1 font-medium">
                                            {item.status === "approved"
                                                ? "Your withdrawal request has been approved. Click 'Withdraw' to complete the transaction."
                                                : "The withdrawal amount has been returned to your account balance."
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2">
                                    {item.status === "approved" ? (
                                        <button
                                            onClick={() => onWithdrawal(item.id)}
                                            className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-md"
                                        >
                                            Withdraw
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onClose}
                                            className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-sm font-semibold rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md"
                                        >
                                            Dismiss
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={onClose}
                                        className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default NotificationBanner;