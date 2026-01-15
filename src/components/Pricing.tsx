
import React, { useState } from 'react';
import { 
  Check, Zap, Crown, Star, Building, 
  Loader2, ArrowRight, ShieldCheck, Lock
} from 'lucide-react';
import { store } from '../state/store';
import { PlanType } from '../types';

const PLANS = [
  {
    id: 'SEMENTE' as PlanType,
    name: 'Semente',
    price: 0,
    desc: 'Básico para organização individual.',
    icon: <Zap className="w-6 h-6 text-emerald-500" />,
    features: ['Até 5 turmas', 'Chamada Digital', 'Notas Básicas'],
    color: 'emerald'
  },
  {
    id: 'DOCENTE' as PlanType,
    name: 'Docente',
    price: 19.90,
    desc: 'O essencial para o professor moderno.',
    icon: <Star className="w-6 h-6 text-indigo-500" />,
    features: ['Turmas Ilimitadas', 'Módulo Tutoria & PDI', 'Ocorrências Detalhadas'],
    highlight: true,
    color: 'indigo'
  },
  {
    id: 'MESTRE' as PlanType,
    name: 'Mestre',
    price: 39.90,
    desc: 'IA completa para sua produtividade.',
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    features: ['Tudo do Docente +', 'Relatórios IA Gemini', 'Gerador de Planos IA'],
    color: 'amber'
  },
  {
    id: 'MESTRE_PLUS' as PlanType,
    name: 'Plus',
    price: 59.90,
    desc: 'Controle total e multi-escola.',
    icon: <Building className="w-6 h-6 text-purple-500" />,
    features: ['Tudo do Mestre +', 'Multi-Escola', 'Gestão Financeira'],
    color: 'purple'
  }
];

export const Pricing: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const userPlan = store.user?.plan;

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (plan.price === 0) {
      store.upgradePlan(plan.id);
      return;
    }

    setLoadingPlan(plan.id);
    
    // MODO ESTÁTICO: Apenas simula ou alerta
    setTimeout(() => {
        alert("O sistema de pagamentos online estará disponível em breve. Por enquanto, aproveite as funcionalidades gratuitas ou entre em contato com o administrador.");
        setLoadingPlan(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 animate-in fade-in duration-700 flex flex-col items-center justify-center">
      
      {/* Cabeçalho de Checkout Minimalista */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Escolha seu Nível</h2>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">
          Ative os recursos avançados de IA e gestão escolar agora mesmo. 
        </p>
      </div>

      {/* Grid de Planos Centrado */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full max-w-7xl">
        {PLANS.map((plan) => {
          const isActive = userPlan === plan.id;
          const isLoading = loadingPlan === plan.id;

          return (
            <div 
              key={plan.id} 
              className={`relative bg-white rounded-[2.5rem] p-8 border transition-all duration-300 flex flex-col ${
                plan.highlight 
                ? 'border-indigo-600 shadow-2xl scale-105 z-10' 
                : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  Mais Popular
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 inline-block mb-6 self-start">
                {plan.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-slate-400 text-[11px] font-bold mb-8 leading-relaxed h-8">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-slate-400 font-bold text-sm ml-1">/mês</span>
              </div>
              
              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-3 text-[11px] text-slate-600 font-bold leading-tight">
                    <Check className={`w-3.5 h-3.5 mt-0.5 ${plan.highlight ? 'text-indigo-600' : 'text-emerald-500'}`} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(plan)}
                disabled={isActive || (loadingPlan !== null)}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  isActive 
                  ? 'bg-slate-100 text-slate-400 cursor-default' 
                  : plan.highlight 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100' 
                    : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-100'
                } disabled:opacity-50`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isActive ? (
                  'Plano Ativo'
                ) : (
                  <>
                    {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selos de Confiança Profissionais */}
      <div className="mt-20 flex flex-col items-center gap-6 opacity-60">
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest">
            <Lock className="w-4 h-4 text-indigo-600" /> Transação Criptografada
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Satisfação Garantida
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest">
            <Zap className="w-4 h-4 text-amber-500" /> Ativação Automática
          </div>
        </div>
      </div>
    </div>
  );
};
