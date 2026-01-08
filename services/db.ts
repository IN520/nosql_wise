
import { User, Transaction, TransactionType } from '../types';

// Keys for localStorage
const USERS_KEY = 'wenli_wallet_users';
const TRANSACTIONS_KEY = 'wenli_wallet_transactions';
const SESSION_KEY = 'wenli_wallet_session';

// Helpers
const getStorage = <T,>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorage = <T,>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Auth
export const register = (username: string, password: string): User | null => {
  const users = getStorage<any>(USERS_KEY);
  if (users.find((u: any) => u.username === username)) return null;
  
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    username,
    password, // 实际应用中应对密码进行哈希处理
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  setStorage(USERS_KEY, users);
  
  const { password: _, ...userWithoutPass } = newUser;
  return userWithoutPass as User;
};

export const login = (username: string, password: string): User | null => {
  const users = getStorage<any>(USERS_KEY);
  const user = users.find((u: any) => u.username === username && u.password === password);
  if (!user) return null;
  
  const { password: _, ...userWithoutPass } = user;
  return userWithoutPass as User;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

// Transactions (模拟 MongoDB 文档风格的 CRUD)
export const getTransactions = (userId: string): Transaction[] => {
  return getStorage<Transaction>(TRANSACTIONS_KEY)
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const transactions = getStorage<Transaction>(TRANSACTIONS_KEY);
  const newTransaction: Transaction = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  transactions.push(newTransaction);
  setStorage(TRANSACTIONS_KEY, transactions);
  return newTransaction;
};

export const updateTransaction = (id: string, data: Partial<Transaction>): Transaction | null => {
  const transactions = getStorage<Transaction>(TRANSACTIONS_KEY);
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updated = { ...transactions[index], ...data };
  transactions[index] = updated;
  setStorage(TRANSACTIONS_KEY, transactions);
  return updated;
};

export const deleteTransaction = (id: string): void => {
  const transactions = getStorage<Transaction>(TRANSACTIONS_KEY);
  const filtered = transactions.filter(t => t.id !== id);
  setStorage(TRANSACTIONS_KEY, filtered);
};
