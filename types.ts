
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  tags?: string[];
  status?: 'PAID' | 'PENDING';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  topCategories: { category: string; amount: number }[];
  dailySpending: { date: string; amount: number }[];
}

export interface AIInsight {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
}

export interface FinancialHealthReport {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}
