// Wallet-related type definitions
export interface Transaction {
  id: string
  type: string
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'purchase'
  amount: number
  description: string
  created_at: string
  status: string
}

export interface UserBalance {
  available_balance: number
  pending_balance: number
  total_balance: number
  created_at: string
  updated_at: string
}

export interface LikeCredits {
  balance: number
  total_purchased: number
  total_used: number
  created_at: string
  updated_at: string
}

export interface WalletData {
  balance: UserBalance
  like_credits: LikeCredits
  transactions: Transaction[]
}