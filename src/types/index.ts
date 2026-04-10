export interface User {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN_KEUANGAN" | "MANAJER" | "VIEWER";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  parentId: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  children?: Category[];
  _count?: { transactions: number };
}

export interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  description: string | null;
  reference: string | null;
  paymentMethod: string | null;
  tags: string[];
  attachmentUrl: string | null;
  isVoided: boolean;
  voidReason: string | null;
  categoryId: string;
  category: Category;
  userId: string;
  user: { name: string };
  createdAt: string;
}

export interface Budget {
  id: string;
  amount: number;
  period: "MONTHLY" | "QUARTERLY" | "YEARLY";
  startDate: string;
  endDate: string;
  categoryId: string;
  category: Category;
  userId: string;
  user: { name: string };
  spent?: number;
  percentage?: number;
  createdAt: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  monthlyComparison: { month: string; income: number; expense: number }[];
  expenseByCategory: { name: string; value: number; color: string }[];
  budgetProgress: {
    category: string;
    budget: number;
    spent: number;
    percentage: number;
  }[];
  recentTransactions: Transaction[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PeriodFilter =
  | "today"
  | "this_week"
  | "this_month"
  | "this_quarter"
  | "this_year"
  | "custom";
