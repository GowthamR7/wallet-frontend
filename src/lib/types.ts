export interface User {
    id: string;
    email: string;
    balance: number;
    ai_avatar_balance: number;
    broadcast_bot_balance: number;
    data_scrap_balance: number;
    meta_ad_balance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Transaction {
    id: string;
    transactionType: 'CREDIT' | 'DEBIT';
    amount: number;
    currency: string;
    product_name: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
    wallet: 'AI_AVATAR' | 'BROADCAST_BOT' | 'META_AD' | 'DATA_SCRAP' | null;
    reason: 'TOPUP' | 'REFUND' | 'SPENT' | 'CANCELLED' | 'ERROR' | 'TRANSFER';
    createdAt: string;
    updatedAt: string;
  }