
import React from 'react';
import { Building2, Plus, ArrowRight, GraduationCap, MapPin } from 'lucide-react';
import { store } from '../state/store';

export const MultiSchool: React.FC = () => {
  const user = store.user;
  const schools = user?.schools || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Minhas Instituições</h2>
          <p className="text-slate-500">Gerencie ambientes separados para cada local de trabalho.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Plus className="w-4 h-4" /> Nova Escola
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schools.map((school) => (
          <div key={school.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Building2 className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Ativa</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{school.name}</h3>
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <GraduationCap className="w-4 h-4" /> 12 Turmas Ativas
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4" /> Unidade Centro
              </div>
            </div>
            <button className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
              Acessar Painel <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer">
           <Plus className="w-12 h-12 mb-4 opacity-20" />
           <p className="font-bold">Adicionar Instituição Parceira</p>
           <p className="text-xs">Ideal para professores que trabalham em várias escolas.</p>
        </div>
      </div>
    </div>
  );
};
