import React from 'react';
import { NAVIGATION_ITEMS, PLAN_RANKS } from '../constants';
import { LogOut, Building2, ChevronDown, Lock, Menu } from 'lucide-react';
import { store } from '../state/store';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const user = store.user;

  const handleLogout = () => {
    if (confirm('Deseja realmente sair do sistema?')) {
      store.logout();
    }
  };

  if (!user) return null;

  const currentPlanRank = PLAN_RANKS[user.plan];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Overlay para Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Lateral */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100">
            <div className="mb-6">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Saber Pedagógico</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Gestão Educacional</p>
            </div>
            
            {(user.plan === 'MESTRE_PLUS' || user.plan === 'GESTOR' || user.role === 'SUPER_ADM' || user.role === 'ADMIN') && (
              <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-indigo-300 transition-all">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 truncate">Sincronizado</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {NAVIGATION_ITEMS.map((item) => {
              const isLocked = item.minPlan && PLAN_RANKS[item.minPlan] > currentPlanRank;
              const forceUnlock = item.id === 'super_adm_panel' || user.role === 'SUPER_ADM' || user.role === 'ADMIN';
              
              return (
                <button
                  key={item.id}
                  disabled={isLocked && !forceUnlock && item.id !== 'pricing'}
                  onClick={() => {
                    if (isLocked && !forceUnlock) setActivePage('pricing');
                    else setActivePage(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
                    ${activePage === item.id 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : (isLocked && !forceUnlock)
                        ? 'text-slate-300 cursor-not-allowed' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { 
                      className: `w-5 h-5 ${activePage === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}` 
                    })}
                    {item.label}
                  </div>
                  {(isLocked && !forceUnlock) && <Lock className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
              <img 
                src={user.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=6366f1&color=fff`} 
                alt="" 
                className="w-8 h-8 rounded-full ring-2 ring-white" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.full_name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black">{user.plan}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal - Sem Header superior */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Gatilho Mobile Minimalista (Absoluto para não gerar faixa) */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden absolute top-6 right-6 z-30 p-2 text-slate-400 hover:text-indigo-600 bg-white/50 hover:bg-white rounded-full transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};