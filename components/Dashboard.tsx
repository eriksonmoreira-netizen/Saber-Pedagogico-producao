
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Clock,
  Database,
  Loader2,
  GraduationCap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { store } from '../state/store';
import { generateTestData } from '../services/dataGenerator';

const dataPerformance = [
  { name: 'Jan', media: 6.5 },
  { name: 'Fev', media: 7.2 },
  { name: 'Mar', media: 6.8 },
  { name: 'Abr', media: 7.9 },
  { name: 'Mai', media: 8.2 },
  { name: 'Jun', media: 7.5 },
];

export const Dashboard: React.FC = () => {
  const user = store.user;
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState({
    students: store.students,
    classes: store.classes,
    occurrences: store.occurrences
  });

  useEffect(() => {
    return store.subscribe(() => {
      setData({
        students: store.students,
        classes: store.classes,
        occurrences: store.occurrences
      });
    });
  }, []);

  const handleSeedData = async () => {
    if (data.students.length > 10 && !confirm('Já existem dados no sistema. Deseja sobrescrever tudo com novos dados de demonstração?')) {
      return;
    }
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const testData = generateTestData();
    store.setAllData(testData);
    setIsGenerating(false);
    alert('Dados de demonstração gerados e salvos com sucesso!');
  };

  const renderStats = () => {
    return [
      { label: 'Meus Alunos', val: data.students.length, icon: <Users className="text-blue-600" />, color: 'blue' },
      { label: 'Minhas Turmas', val: data.classes.length, icon: <BookOpen className="text-indigo-600" />, color: 'indigo' },
      { label: 'Média Turmas', val: data.students.length > 0 ? '7.8' : '0.0', icon: <TrendingUp className="text-emerald-600" />, color: 'emerald' },
      { label: 'Frequência Média', val: data.students.length > 0 ? '94%' : '0%', icon: <CheckCircle className="text-amber-600" />, color: 'amber' },
    ].map((stat, idx) => (
      <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-${stat.color}-50`}>
            {stat.icon}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-black text-slate-900">{stat.val}</h3>
          <p className="text-[10px] font-bold text-slate-400 pb-1">DB Ativo</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Olá, Prof. {user?.full_name.split(' ')[0]}</h2>
          <p className="text-slate-500">Gestão de turmas e alunos com persistência total de dados.</p>
        </div>

        <button 
          onClick={handleSeedData}
          disabled={isGenerating}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl flex items-center gap-3 active:scale-95 disabled:opacity-70"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
          {isGenerating ? 'Salvando no BD...' : 'Gerar Dados de Demonstração (Seed)'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStats()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Média Geral de Aprendizagem
              </h4>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase">Meta: 8.0</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataPerformance}>
                  <defs>
                    <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 10]} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="media" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorMedia)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold">IA Pedagógica</h4>
              </div>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                {data.students.length > 0 
                  ? 'Analisando sua base de dados atualizada. Todas as suas alterações em notas e faltas são usadas para recalcular os riscos pedagógicos em tempo real.' 
                  : 'Aguardando dados para análise. Use o botão de geração acima para iniciar o banco de dados.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
