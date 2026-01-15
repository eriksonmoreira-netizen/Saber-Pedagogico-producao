
import React, { useState } from 'react';
import { MOCK_CLASSES } from '../constants';
import { 
  FileDown, 
  BarChart3, 
  Calendar, 
  Filter, 
  ChevronDown, 
  ArrowUpRight, 
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const dummyData = [
  { label: '9º Ano A', value: 8.5 },
  { label: '1º EM B', value: 7.2 },
  { label: '8º Ano C', value: 7.8 },
  { label: '9º Ano B', value: 8.1 },
];

export const Reports: React.FC = () => {
  const [filterType, setFilterType] = useState('PERFORMANCE');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportCSV = () => {
    alert('Relatório exportado com sucesso em formato CSV!');
  };

  const handleExportPDF = () => {
    alert('Gerando documento PDF... O download iniciará em instantes.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Módulo de Relatórios</h2>
          <p className="text-slate-500">Gere análises detalhadas e exporte dados para gestão escolar.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Planilha (CSV)
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Documento (PDF)
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold">
          <Filter className="w-5 h-5 text-indigo-600" />
          Filtros do Relatório Personalizado
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Relatório</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="PERFORMANCE">Desempenho Acadêmico</option>
              <option value="ATTENDANCE">Frequência Escolar</option>
              <option value="OCCURRENCE">Registros de Ocorrências</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Turma/Classe</label>
            <select className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all">
              <option>Todas as Turmas</option>
              {MOCK_CLASSES.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Inicial</label>
            <input type="date" className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Final</label>
            <input type="date" className="w-full bg-slate-50 border-none rounded-xl text-sm p-3 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
           <button 
             onClick={() => { setIsGenerating(true); setTimeout(() => setIsGenerating(false), 1500); }}
             className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
           >
             {isGenerating ? 'Processando dados...' : 'Gerar Relatório'}
           </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <BarChart3 className="w-5 h-5 text-indigo-600" />
                 Visualização de Tendências
               </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Tabela de Dados Analíticos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Métrica</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Valor Médio</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Variação</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { m: 'Desempenho Geral', v: '78.5%', t: '+4.2%', s: 'INCREASING' },
                    { m: 'Taxa de Retenção', v: '92.1%', t: '-1.0%', s: 'STABLE' },
                    { m: 'Engajamento Tutorias', v: '65%', t: '+12%', s: 'INCREASING' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{row.m}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{row.v}</td>
                      <td className={`px-6 py-4 text-sm font-bold ${row.t.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{row.t}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.s === 'INCREASING' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                          {row.s === 'INCREASING' ? 'Em Alta' : 'Estável'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Templates */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-6 text-white">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Relatórios Periódicos
            </h4>
            <p className="text-sm text-indigo-100 mb-6">
              Configure o envio automático de relatórios para seu e-mail ou para a coordenação.
            </p>
            <div className="space-y-3">
               {['Semanal', 'Mensal', 'Bimestral'].map(period => (
                 <button key={period} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10">
                   <span className="text-sm font-medium">{period}</span>
                   <ChevronDown className="w-4 h-4" />
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Modelos Salvos</h4>
            <div className="space-y-4">
               {[
                 'Performance Turmas 9º Ano',
                 'Absenteísmo Semestral',
                 'Análise de Ocorrências Graves'
               ].map((temp, i) => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600 group-hover:text-indigo-600 font-medium">{temp}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-2 border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 text-xs font-bold rounded-xl transition-all">
              SALVAR NOVO MODELO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
