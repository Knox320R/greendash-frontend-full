// Transaction Types
export interface Transaction {
    id: number;
    user_id: number;
    transaction_type: 'staking_payment' | 'staking_reward' | 'referral_bonus' | 'network_bonus' | 'universal_bonus' | 'performance_bonus' | 'viral_bonus' | 'token_purchase' | 'token_sale' | 'withdrawal_request' | 'withdrawal_approved' | 'withdrawal_rejected' | 'token_conversion' | 'fee_collection' | 'refund';
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
    description: string;
    reference_id?: string;
    reference_type?: string;
    wallet_address?: string;
    transaction_hash?: string;
    block_number?: number;
    gas_used?: number;
    gas_price?: number;
    network_fee?: number;
    platform_fee?: number;
    exchange_rate?: number;
    balance_before?: number;
    balance_after?: number;
    metadata?: any;
    processed_by?: number;
    processed_at?: string;
    notes?: string;
    is_manual: boolean;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    updated_at: string;
}

// Withdrawal Types
export interface Withdrawal {
    id: number;
    user_id: number;
    amount: number;
    currency: 'USDT' | 'EGD';
    wallet_address: string;
    network: string;
    status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
    withdrawal_fee: number;
    net_amount: number;
    transaction_hash?: string;
    block_number?: number;
    gas_used?: number;
    gas_price?: number;
    network_fee?: number;
    processed_by?: number;
    processed_at?: string;
    approved_at?: string;
    completed_at?: string;
    rejection_reason?: string;
    notes?: string;
    user_balance_before?: number;
    user_balance_after?: number;
    ip_address?: string;
    user_agent?: string;
    is_manual: boolean;
    estimated_completion?: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
}

// Payment Types
export interface PaymentAddress {
    payment_id: string;
    payment_address: string;
    amount: number;
    network: string;
    currency: string;
    transaction_id: number;
    qr_code: string;
}

export interface PaymentVerification {
    transaction_id: number;
    transaction_hash: string;
    block_number?: number;
}

// Form Types
export interface GeneratePaymentAddressForm {
    amount: number;
}

export interface RequestWithdrawalForm {
    amount: number;
    currency: 'USDT' | 'EGD';
    wallet_address: string;
    network: string;
}

export interface ConvertTokensForm {
    amount: number;
}

// API Response Types
export interface PaymentAddressResponse {
    success: boolean;
    message: string;
    data: PaymentAddress;
}

export interface PaymentVerificationResponse {
    success: boolean;
    message: string;
    data: {
        egd_tokens_credited: number;
        new_balance: number;
    };
}

export interface TokenConversionResponse {
    success: boolean;
    message: string;
    data: {
        egd_amount: number;
        usdt_amount: number;
        exchange_rate: number;
        new_egd_balance: number;
        new_usdt_balance: number;
    };
}

export interface WithdrawalRequestResponse {
    success: boolean;
    message: string;
    data: {
        withdrawal: {
            id: number;
            amount: number;
            net_amount: number;
            status: string;
            estimated_completion: string;
        };
    };
}

export interface WithdrawalsResponse {
    success: boolean;
    data: {
        withdrawals: Withdrawal[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
        };
    };
}

export interface WithdrawalDetailsResponse {
    success: boolean;
    data: {
        withdrawal: Withdrawal;
    };
}

export interface TransactionsResponse {
    success: boolean;
    data: {
        transactions: Transaction[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
        };
    };
}

// Payment Statistics
export interface PaymentStats {
    total_transactions: number;
    total_volume: number;
    pending_transactions: number;
    completed_transactions: number;
    failed_transactions: number;
}

export interface WithdrawalStats {
    total_withdrawals: number;
    total_amount: number;
    pending_withdrawals: number;
    pending_amount: number;
    completed_withdrawals: number;
    completed_amount: number;
}

// Network Configuration
export interface NetworkConfig {
    name: string;
    code: string;
    chain_id: number;
    rpc_url: string;
    explorer_url: string;
    native_currency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    contracts: {
        usdt: string;
        egd?: string;
    };
}

// Supported Networks
export const SUPPORTED_NETWORKS: NetworkConfig[] = [
    {
        name: 'Binance Smart Chain',
        code: 'BEP20',
        chain_id: 56,
        rpc_url: 'https://bsc-dataseed1.binance.org/',
        explorer_url: 'https://bscscan.com',
        native_currency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
        contracts: {
            usdt: '0x55d398326f99059fF775485246999027B3197955'
        }
    },
    {
        name: 'Ethereum',
        code: 'ERC20',
        chain_id: 1,
        rpc_url: 'https://mainnet.infura.io/v3/',
        explorer_url: 'https://etherscan.io',
        native_currency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },
        contracts: {
            usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        }
    }
];

// Transaction Type Labels
export const TRANSACTION_TYPE_LABELS = {
    staking_payment: 'Staking Payment',
    staking_reward: 'Staking Reward',
    referral_bonus: 'Referral Bonus',
    network_bonus: 'Network Bonus',
    universal_bonus: 'Universal Bonus',
    performance_bonus: 'Performance Bonus',
    viral_bonus: 'Viral Bonus',
    token_purchase: 'Token Purchase',
    token_sale: 'Token Sale',
    withdrawal_request: 'Withdrawal Request',
    withdrawal_approved: 'Withdrawal Approved',
    withdrawal_rejected: 'Withdrawal Rejected',
    token_conversion: 'Token Conversion',
    fee_collection: 'Fee Collection',
    refund: 'Refund'
} as const;

// Status Labels
export const STATUS_LABELS = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    processing: 'Processing',
    approved: 'Approved',
    rejected: 'Rejected'
} as const; 