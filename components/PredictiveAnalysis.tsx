
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Brain, TrendingDown, Users, AlertTriangle, Sparkles } from 'lucide-react';
import { store } from '../state/store';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const RISK_DATA = [
  { name: 'Baixo Risco', value: 245, color: '#10b981' },
  { name: 'Médio Risco', value: 42, color: '#f59e0b' },
  { name: 'Alto Risco', value: 13, color: '#ef4444' },
];

export const PredictiveAnalysis: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
         <Sparkles className="absolute top-0 right-0 w-64 h-64 text-white opacity-5 -mr-20 -mt-20" />
         <div className="relative z-10">
           <div className="flex items-center gap-2 mb-4">
             <Brain className="w-8 h-8" />
             <h2 className="text-3xl font-bold">Predictive AI Insights</h2>
           </div>
           <p className="text-indigo-100 max-w-2xl text-lg">
             Nossa IA analisou mais de 12.000 pontos de dados para identificar alunos que precisam de suporte imediato.
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <h4 className="font-bold text-slate-800 mb-6">Status Geral de Risco</h4>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={RISK_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {RISK_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="w-full space-y-2">
              {RISK_DATA.map(r => (
                <div key={r.name} className="flex justify-between items-center text-sm font-medium">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: r.color}}></span> {r.name}</span>
                  <span className="text-slate-700 font-bold">{r.value} Alunos</span>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" /> Casos Críticos (Intervenção Imediata)
              </h4>
              <div className="space-y-4">
                {[
                  { name: 'Ana Carolina Lima', motivo: 'Queda de 35% na média em 15 dias', risco: 'CRÍTICO' },
                  { name: 'Ricardo Mendes', motivo: '5 faltas consecutivas injustificadas', risco: 'ALTO' },
                  { name: 'Patrícia Souza', motivo: 'Anomalia comportamental detectada', risco: 'ALTO' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl group cursor-pointer hover:bg-red-50 transition-all">
                    <div>
                      <p className="font-bold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.motivo}</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">Ação Recomendada</button>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Sugestões Pedagógicas Automáticas
              </h4>
              <p className="text-sm text-indigo-700 leading-relaxed mb-4">
                Com base nos padrões de 2023, recomendamos que o <strong>9º Ano A</strong> receba um reforço focado em Geometria, onde a queda de desempenho foi mais acentuada no segundo bimestre.
              </p>
              <button className="text-sm font-bold text-indigo-600 hover:underline">Baixar Relatório de Sugestões</button>
           </div>
        </div>
      </div>
    </div>
  );
};
