
import React, { useState } from 'react';
import { LogOut, Menu, LayoutDashboard } from 'lucide-react';
import { store } from '../state/store';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = store.user;

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Saber</h1>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Pedagógico</p>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={() => { setActivePage('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activePage === 'dashboard' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Início
            </button>
            {/* Outros itens de menu serão adicionados conforme construímos */}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={() => store.logout()} 
              className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="lg:hidden p-4 flex justify-end">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-lg shadow-sm">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
