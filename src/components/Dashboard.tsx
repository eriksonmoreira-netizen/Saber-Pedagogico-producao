
import React from 'react';
import { store } from '../state/store';

export const Dashboard: React.FC = () => {
  const user = store.user;

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-slate-50">
        👋
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Olá, {user?.full_name}!</h2>
        <p className="text-slate-500 font-medium">
          O sistema foi reiniciado. Sua "árvore" está limpa e pronta para crescer.
          <br/>Selecione um módulo no menu para começar.
        </p>
      </div>
    </div>
  );
};
