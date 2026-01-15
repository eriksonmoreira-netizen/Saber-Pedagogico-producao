
import React, { useState, useEffect } from 'react';
import { 
  User, 
  School, 
  Bell, 
  Lock, 
  Globe, 
  Save, 
  Camera, 
  Mail, 
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Link2,
  Trash2,
  AlertTriangle,
  RefreshCcw,
  CreditCard,
  Download,
  Calendar,
  Zap,
  ArrowRight,
  // Added missing QrCode icon import from lucide-react
  QrCode
} from 'lucide-react';
import { store } from '../state/store';
import { Invoice } from '../types';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isSaving, setIsSaving] = useState(false);
  const [isReseting, setIsReseting] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(store.invoices);
  const user = store.user;

  useEffect(() => {
    return store.subscribe(() => {
      setInvoices(store.invoices);
    });
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações salvas com sucesso!');
    }, 1000);
  };

  const handleResetDatabase = () => {
    if (confirm('ATENÇÃO: Isso irá apagar todos os alunos, turmas, notas e ocorrências geradas. Deseja continuar?')) {
      setIsReseting(true);
      setTimeout(() => {
        store.reset();
        setIsReseting(false);
        alert('Banco de dados restaurado ao estado inicial.');
      }, 1500);
    }
  };

  const tabs = [
    { id: 'perfil', label: 'Meu Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'escola', label: 'Instituição', icon: <School className="w-4 h-4" /> },
    { id: 'faturamento', label: 'Faturamento', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notificacoes', label: 'Notificações', icon: <Bell className="w-4 h-4" /> },
    { id: 'seguranca', label: 'Segurança', icon: <Lock className="w-4 h-4" /> },
  ];

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configurações</h2>
          <p className="text-slate-500">Gerencie sua conta e preferências do sistema.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Alterações</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 space-y-8">
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-800">Informações Pessoais</h3>
                
                <div className="flex flex-col sm:flex-row gap-8 items-center">
                  <div className="relative group">
                    <img 
                      src={user.photo_url || 'https://ui-avatars.com/api/?name=' + user.full_name} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-50"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome Completo</label>
                      <input type="text" defaultValue={user.full_name} className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Profissional</label>
                      <input type="email" defaultValue={user.email} className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'faturamento' && (
            <div className="space-y-6">
              {/* Plano Atual Card */}
              <section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-2">
                     <p className="text-xs font-black uppercase tracking-widest text-indigo-200">Plano Ativo</p>
                     <h3 className="text-4xl font-black italic tracking-tighter uppercase">{user.plan}</h3>
                     <p className="text-indigo-100/70 text-sm font-medium">Assinatura mensal • Renovação em 12/04/2025</p>
                   </div>
                   <div className="flex gap-3">
                     <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all">Alterar Plano</button>
                     <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm border border-indigo-400/30 hover:bg-indigo-400 transition-all">Cancelar</button>
                   </div>
                 </div>
              </section>

              {/* Histórico de Invoices */}
              <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-800">Histórico de Cobrança</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fatura</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Método</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Recibo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices.length > 0 ? invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm">{inv.id}</span>
                              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">Pago</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-xs text-slate-500 font-bold">{new Date(inv.date).toLocaleDateString()}</td>
                          <td className="px-8 py-5 font-black text-slate-800 text-sm">R$ {inv.amount.toFixed(2).replace('.', ',')}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              {inv.method === 'CARD' ? <CreditCard className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
                              {inv.method === 'CARD' ? 'Cartão' : 'Pix'}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all"><Download className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-400 italic">Nenhuma fatura encontrada.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Security Banner */}
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><ShieldCheck className="w-6 h-6 text-emerald-400" /></div>
                  <div>
                    <p className="text-sm font-bold">Transações Criptografadas</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Certificado PCI DSS Level 1</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium max-w-xs text-right hidden md:block">
                  Não armazenamos os dados sensíveis do seu cartão. Todas as cobranças são processadas via tokens seguros.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'escola' && (
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Dados da Instituição</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Escola Principal</label>
                  <input type="text" defaultValue="Colégio Saber" className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ano Letivo</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500">
                    <option>2024</option>
                    <option>2025</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Manutenção */}
          {activeTab === 'seguranca' && (
             <section className="bg-red-50 border border-red-100 p-8 rounded-[2rem] space-y-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Zona de Perigo</h3>
                </div>
                <button onClick={handleResetDatabase} disabled={isReseting} className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50">
                  {isReseting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Limpar Banco de Dados
                </button>
             </section>
          )}
        </div>
      </div>
    </div>
  );
};
