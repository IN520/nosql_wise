
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Lock, UserPlus } from 'lucide-react';
import * as db from '../services/db';
import { User } from '../types';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('为了安全，密码长度请不少于 6 位');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次填写的密码不一致，请核对');
      return;
    }
    const user = db.register(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError('该用户名已被占用，请换一个吧');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-emerald-400 blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[5%] w-80 h-80 rounded-full bg-emerald-300 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 bg-emerald-600 text-white rounded-[2rem] shadow-2xl mb-6 transform hover:rotate-3 transition-transform duration-300">
            <UserPlus size={40} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">开启理财之旅</h2>
          <p className="mt-3 text-gray-500 font-medium">文理小钱包，让每笔开支都有迹可循</p>
        </div>
        
        <form className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-10 space-y-6 border border-white/20" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm text-center font-bold border border-rose-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">设置账号</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                  placeholder="你的独特用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">设置密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                  placeholder="不少于 6 位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                  placeholder="请再次输入以确认"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-xl shadow-emerald-200 text-lg font-black text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all active:scale-95"
          >
            注册并开始
          </button>

          <p className="text-center text-sm text-gray-500 font-medium pt-2">
            已经有账号？{' '}
            <Link to="/login" className="font-black text-emerald-600 hover:text-emerald-500 transition-colors">
              直接登录
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
