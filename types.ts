
export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  username: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}

export const CATEGORIES = {
  expense: ['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '住房', '其他'],
  income: ['工资', '理财', '红包', '兼职', '奖金', '其他']
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
