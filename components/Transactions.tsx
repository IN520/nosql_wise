
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';
import * as db from '../services/db';
import { Plus, Search, Filter, Trash2, Edit2, X, ReceiptText } from 'lucide-react';

const Transactions: React.FC<{ user: { id: string } }> = ({ user }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Transaction, 'id' | 'createdAt' | 'userId'>>({
    type: 'expense',
    category: CATEGORIES.expense[0],
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setTransactions(db.getTransactions(user.id));
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return alert('请输入大于 0 的金额');

    if (editingId) {
      db.updateTransaction(editingId, formData);
    } else {
      db.addTransaction({ ...formData, userId: user.id });
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      type: 'expense',
      category: CATEGORIES.expense[0],
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    loadData();
  };

  const handleEdit = (t: Transaction) => {
    setEditingId(t.id);
    setFormData({
      type: t.type,
      category: t.category,
      amount: t.amount,
      date: t.date,
      note: t.note
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条账单吗？')) {
      db.deleteTransaction(id);
      loadData();
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filterType === 'all' || t.type === filterType;
      const searchMatch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [transactions, filterType, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">账单明细</h2>
        <button 
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95 font-bold"
        >
          <Plus size={20} />
          <span>添加账单</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索分类或备注..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto p-1 bg-gray-50 rounded-2xl">
          {(['all', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                filterType === type 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type === 'all' ? '全部' : type === 'income' ? '收入' : '支出'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTransactions.map(t => (
          <div key={t.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group transition-all hover:shadow-md hover:-translate-y-1">
            <div className={`p-4 rounded-2xl ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
              <ReceiptText size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-gray-800 truncate">{t.category}</h4>
                <p className={`font-black text-lg ${t.type === 'income' ? 'text-green-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'}¥{t.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-400 truncate">{t.date} {t.note && `• ${t.note}`}</p>
                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(t)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="编辑"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="删除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <div className="bg-white py-20 rounded-3xl shadow-sm border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Filter size={40} className="opacity-20" />
            </div>
            <p className="font-medium">暂无符合条件的账单记录</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-600 text-white">
              <h3 className="text-xl font-bold">{editingId ? '编辑记录' : '新账单'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex p-1.5 bg-gray-100 rounded-2xl">
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${formData.type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500'}`}
                  onClick={() => {
                    setFormData({ ...formData, type: 'expense', category: CATEGORIES.expense[0] });
                  }}
                >
                  支出
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${formData.type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                  onClick={() => {
                    setFormData({ ...formData, type: 'income', category: CATEGORIES.income[0] });
                  }}
                >
                  收入
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">日期</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">分类</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES[formData.type].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">金额 (元)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">¥</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-3xl font-black focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.amount || ''}
                    onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">备注</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium resize-none"
                  placeholder="写点备注吧..."
                  rows={2}
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all active:scale-95 ${formData.type === 'income' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'}`}
              >
                {editingId ? '保存修改' : '确认添加'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
