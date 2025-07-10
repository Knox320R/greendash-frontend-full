import { UpdatedWithdrawal } from '@/types/landing';
import React from 'react';

interface NotificationBannerProps {
    notes: UpdatedWithdrawal[];
    onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notes, onClose }) => (
      
    <div className="fixed top-36 px-6 left-0 w-full bg-blue-400 py-6 z-50 flex justify-around items-center shadow-md">
        {
            notes.map(item =>
                <div key={item.id} className="">
                    <span className={`text-yellow-${item.status === "approved"? 200: 900} font-semibold`}>
                        {item.status === "approved"
                            ? "Your withdrawal request has been approved by the administrator. " + item.amount + "USDT has been added to your wallet." 
                            : `The withdrawal request amount of ${ item.amount } USDT has been returned to your account.`
                        }
                    </span>
                </div>
            )
        }
        <button
            onClick={onClose}
            className="ml-6 px-14 py-2 bg-white text-green-600 rounded font-bold hover:bg-green-100 transition shadow"
        >
            OK
        </button>
    </div>
);

export default NotificationBanner;