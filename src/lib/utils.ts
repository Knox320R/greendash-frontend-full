import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dashboard utility functions
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const getDateRangeForPeriod = (period: 'today' | 'week' | 'month' | 'custom'): { start_date: string; end_date: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        start_date: formatDateForAPI(today),
        end_date: formatDateForAPI(today)
      };
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      return {
        start_date: formatDateForAPI(weekStart),
        end_date: formatDateForAPI(today)
      };
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        start_date: formatDateForAPI(monthStart),
        end_date: formatDateForAPI(today)
      };
    default:
      return {
        start_date: formatDateForAPI(today),
        end_date: formatDateForAPI(today)
      };
  }
};

export const formatCurrency = (amount: number, currency: string = 'USDT'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const getTransactionTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    staking: 'Staking',
    daily_reward: 'Daily Reward',
    withdrawal: 'Withdrawal',
    weak_leg_bonus: 'Weak Leg Bonus',
    purchase: 'Purchase',
    universal_cashback: 'Universal Cashback',
    unilevel_commission: 'Unilevel Commission',
    admin_adjustment: 'Admin Adjustment'
  };
  return typeLabels[type] || type;
};

export const getWithdrawalStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: 'text-yellow-600',
    approved: 'text-blue-600',
    completed: 'text-green-600',
    rejected: 'text-red-600'
  };
  return statusColors[status] || 'text-gray-600';
};

// Format numbers with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Format date
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Format date with time
export function formatDateTime(dateString: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Truncate wallet address for display
export function truncateAddress(address: string): string {
  if (!address) return 'N/A';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format large numbers with K, M, B suffixes
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
