
import React from 'react';
import { Wallet, TrendingUp, Calendar, ArrowUpRight, DollarSign, Download } from 'lucide-react';

export const Finance: React.FC = () => {
  const transactions = [
    { school: 'Colégio Alpha', val: 4500, status: 'RECEIVED', date: '05/03/2024' },
    { school: 'Aulas Particulares (Pedro)', val: 350, status: 'PENDING', date: '10/03/2024' },
    { school: 'Escola Beta', val: 3200, status: 'SCHEDULED', date: '01/04/2024' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão Financeira</h2>
          <p className="text-slate-500">Controle seus recebimentos de todas as instituições.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all">
          <Download className="w-4 h-4" /> Exportar Extrato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Mês</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">R$ 8.050,00</h3>
          <p className="text-emerald-600 text-xs font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs mês anterior</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Calendar /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendente</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">R$ 350,00</h3>
          <p className="text-slate-400 text-xs mt-2">Próximo: 10 de Março</p>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100">
          <h4 className="font-bold mb-2">Dica da IA Financeira</h4>
          <p className="text-xs text-indigo-100 leading-relaxed">Você teve um aumento de 20% em horas extras na Escola Beta. Considere reservar uma parte para sua previdência.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-slate-800">Histórico de Recebimentos</h3></div>
        <div className="divide-y divide-slate-100">
          {transactions.map((t, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${t.status === 'RECEIVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}><Wallet className="w-5 h-5" /></div>
                <div>
                  <p className="font-bold text-slate-800">{t.school}</p>
                  <p className="text-xs text-slate-400">{t.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">R$ {t.val.toLocaleString()}</p>
                <span className={`text-[10px] font-black uppercase ${t.status === 'RECEIVED' ? 'text-emerald-600' : 'text-amber-500'}`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
