
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import * as db from '../services/db';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

const Dashboard: React.FC<{ user: { id: string } }> = ({ user }) => {
  const navigate = useNavigate();
  const transactions = useMemo(() => db.getTransactions(user.id), [user.id]);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const pieData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });
    return Object.keys(categoryMap).map(name => ({
      name,
      value: categoryMap[name]
    }));
  }, [transactions]);

  const barData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const income = dayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { date: date.split('-').slice(1).join('/'), income, expense };
    });
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">概览统计</h2>
        <button 
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
        >
          <PlusCircle size={20} />
          <span>记一笔</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">账户余额</p>
            <h3 className="text-2xl font-bold text-gray-900">¥{stats.balance.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">累计收入</p>
            <h3 className="text-2xl font-bold text-green-600">¥{stats.income.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-rose-100 text-rose-600 p-3 rounded-2xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">累计支出</p>
            <h3 className="text-2xl font-bold text-rose-600">¥{stats.expense.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">支出分类分析</h3>
          <div className="h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `¥${value.toFixed(2)}`} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                暂无支出数据
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">近 7 日趋势</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `¥${value.toFixed(2)}`} 
                />
                <Legend iconType="circle" />
                <Bar dataKey="income" name="收入" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="支出" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800">最近交易</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-gray-400 font-bold text-xs uppercase tracking-wider">日期</th>
                <th className="py-3 px-4 text-gray-400 font-bold text-xs uppercase tracking-wider">分类</th>
                <th className="py-3 px-4 text-gray-400 font-bold text-xs uppercase tracking-wider">备注</th>
                <th className="py-3 px-4 text-gray-400 font-bold text-xs uppercase tracking-wider text-right">金额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.slice(0, 5).map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-600">{t.date}</td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">{t.category}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 max-w-[200px] truncate">{t.note || '-'}</td>
                  <td className={`py-4 px-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}¥{t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 italic">尚无交易记录，开启你的理财第一步吧</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
