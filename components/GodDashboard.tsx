
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Target, 
  Search, 
  Filter,
  ArrowUpRight,
  Sparkles,
  Edit2,
  UserCheck,
  CreditCard,
  X,
  Check,
  Loader2,
  Plus,
  Trash2,
  Mail,
  User as UserIcon,
  Shield,
  Zap,
  Lock,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { store } from '../state/store';
import { User, PlanType, UserRole } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const dataGrowth = [
  { name: '15/03', users: 120 },
  { name: '17/03', users: 185 },
  { name: '19/03', users: 240 },
  { name: '21/03', users: 310 },
  { name: '23/03', users: 450 },
  { name: '25/03', users: 580 },
];

const planDist = [
  { name: 'Semente', val: 320, color: '#10b981' },
  { name: 'Docente', val: 140, color: '#6366f1' },
  { name: 'Mestre', val: 85, color: '#f59e0b' },
  { name: 'Plus', val: 35, color: '#a855f7' },
];

export const GodDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'USERS'>('MONITOR');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>(store.registeredUsers);
  const [isSaving, setIsSaving] = useState(false);

  // Form para novo usuário
  const [newUser, setNewUser] = useState<Partial<User>>({
    full_name: '',
    email: '',
    role: 'TEACHER',
    plan: 'SEMENTE'
  });

  useEffect(() => {
    return store.subscribe(() => {
      setAllUsers([...store.registeredUsers]);
    });
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter(u => 
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // Ordenação por ID (mais novos no topo)
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [allUsers, searchTerm]);

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSaving(true);
    setTimeout(() => {
      // Fixed: Using the correct method from DataStore (updateUserBySuperAdm)
      store.updateUserBySuperAdm(editingUser.id, editingUser);
      setEditingUser(null);
      setIsSaving(false);
    }, 600);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.full_name || !newUser.email) {
      alert("Dados obrigatórios faltando.");
      return;
    }

    setIsSaving(true);
    // Added status and created_at to satisfy User interface
    const userToCreate: User = {
      id: `u-${Date.now()}`,
      full_name: newUser.full_name!,
      email: newUser.email!,
      role: newUser.role as UserRole,
      plan: newUser.plan as PlanType,
      status: 'ativo',
      created_at: new Date().toISOString(),
      photo_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.full_name!)}&background=6366f1&color=fff`,
    };

    setTimeout(() => {
      // Fixed: Using the correct method from DataStore (addUserBySuperAdm)
      store.addUserBySuperAdm(userToCreate);
      setIsAddingUser(false);
      setNewUser({ full_name: '', email: '', role: 'TEACHER', plan: 'SEMENTE' });
      setIsSaving(false);
    }, 600);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("ATENÇÃO: Deseja remover permanentemente este usuário? O acesso será revogado em tempo real.")) {
      // Fixed: Using the correct method from DataStore (deleteUserBySuperAdm)
      store.deleteUserBySuperAdm(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header God Mode */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-red-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">Control Panel <span className="text-red-500">GOD</span></h2>
            </div>
            <p className="text-slate-400 font-medium italic">Monitoramento de infraestrutura e gestão global de registros.</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('MONITOR')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MONITOR' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Métricas
            </button>
            <button 
              onClick={() => setActiveTab('USERS')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'USERS' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Base de Usuários ({allUsers.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'MONITOR' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Taxa de Conversão de Planos
                </h4>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full">+12% este mês</div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataGrowth}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Distribuição de Receita
              </h4>
              <div className="h-56 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={planDist} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: '#64748b', fontSize: 11, fontWeight: '700'}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={20}>
                      {planDist.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {planDist.map(p => (
                  <div key={p.name} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="text-xs font-bold text-slate-500">{p.name}</span>
                    <span className="text-sm font-black text-slate-800">{p.val}</span>
                  </div>
                ))}
              </div>
            </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-500">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Gestão de Usuários Registrados</h3>
              <p className="text-slate-500 text-sm">Controle total sobre identidades, privilégios e subscrições.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="E-mail ou nome..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500 w-64 font-medium"
                />
              </div>
              <button 
                onClick={() => setIsAddingUser(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
                <UserPlus className="w-4 h-4" />
                Novo Usuário
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Acesso</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status de Faturamento</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img src={u.photo_url} className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" alt="" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{u.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {/* Fixed: Comparison with 'SUPER_ADM' instead of 'GOD' */}
                        <UserCheck className={`w-4 h-4 ${u.role === 'SUPER_ADM' ? 'text-red-500' : 'text-indigo-500'}`} />
                        <span className="text-xs font-bold text-slate-700">{u.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                          u.plan === 'SEMENTE' ? 'bg-emerald-50 text-emerald-600' : 
                          u.plan === 'GESTOR' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {u.plan}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingUser(u)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-slate-400 italic">Nenhum usuário coincide com os filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Adicionar Usuário Manualmente */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleAddUser}>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-red-600 text-white">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-6 h-6" />
                  <h3 className="text-xl font-black italic tracking-tighter uppercase">Injetar Novo Acesso</h3>
                </div>
                <button type="button" onClick={() => setIsAddingUser(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Login</label>
                      <input 
                        type="email" 
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo</label>
                        <select 
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                          className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                        >
                          <option value="TEACHER">Professor</option>
                          <option value="COORDINATOR">Coordenador</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plano Inicial</label>
                        <select 
                          value={newUser.plan}
                          onChange={(e) => setNewUser({...newUser, plan: e.target.value as any})}
                          className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                        >
                          <option value="SEMENTE">Semente</option>
                          <option value="DOCENTE">Docente</option>
                          <option value="MESTRE">Mestre</option>
                        </select>
                      </div>
                   </div>
                 </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingUser(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Descartar</button>
                <button type="submit" disabled={isSaving} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg flex items-center gap-2">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Editar Dados e Plano */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleUpdateUser}>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-black italic tracking-tighter uppercase">Configuração de Acesso</h3>
                </div>
                <button type="button" onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img src={editingUser.photo_url} className="w-16 h-16 rounded-full ring-4 ring-white shadow-md" alt="" />
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text"
                      value={editingUser.full_name}
                      onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                      className="w-full bg-white border-none text-sm font-bold text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500 rounded-lg p-2"
                      placeholder="Nome completo"
                    />
                    <input 
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full bg-white border-none text-sm font-bold text-slate-600 ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500 rounded-lg p-2"
                      placeholder="E-mail"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Forçar Upgrade</label>
                    <select 
                      value={editingUser.plan}
                      onChange={(e) => setEditingUser({...editingUser, plan: e.target.value as PlanType})}
                      className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="SEMENTE">Semente (Free)</option>
                      <option value="DOCENTE">Docente</option>
                      <option value="MESTRE">Mestre</option>
                      <option value="MESTRE_PLUS">Mestre Plus</option>
                      <option value="GESTOR">Gestor (Enterprise)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Permissões de Cargo</label>
                    <select 
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                      className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="TEACHER">Professor</option>
                      <option value="COORDINATOR">Coordenador</option>
                      <option value="ADMIN">Administrador</option>
                      <option value="PARENT">Responsável</option>
                      {/* Fixed: Changed 'GOD' to 'SUPER_ADM' to match UserRole type */}
                      <option value="SUPER_ADM">Master GOD</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-800">
                  <Lock className="w-5 h-5 shrink-0" />
                  <p className="text-[11px] leading-relaxed font-bold italic">
                    Alterações manuais de plano feitas via Painel GOD ignoram gateways de pagamento.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg flex items-center gap-2">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  Atualizar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
