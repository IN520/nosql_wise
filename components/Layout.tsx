
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, ReceiptText, Wallet } from 'lucide-react';

interface LayoutProps {
  user: { username: string };
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '仪表盘', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: '账单明细', icon: <ReceiptText size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* 侧边栏 */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm z-10">
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">文理小钱包</h1>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600">
            <div className="bg-gray-200 rounded-full p-2">
              <User size={18} />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-bold truncate">{user.username}</p>
              <p className="text-xs text-gray-400">在线</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主体内容 */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
