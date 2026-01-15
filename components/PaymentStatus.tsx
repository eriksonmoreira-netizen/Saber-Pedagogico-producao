
import React from 'react';
import { CheckCircle2, XCircle, Clock, ArrowRight, LayoutDashboard, CreditCard } from 'lucide-react';

interface PaymentStatusProps {
  status: 'success' | 'error' | 'pending';
  onGoToDashboard: () => void;
  onRetry: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, onGoToDashboard, onRetry }) => {
  const configs = {
    success: {
      icon: <CheckCircle2 className="w-20 h-20 text-emerald-500" />,
      title: "Parabéns!",
      message: "Seu pagamento foi aprovado. Acesse seu painel agora para aproveitar todos os recursos do seu novo plano.",
      buttonText: "Ir para o Painel",
      buttonAction: onGoToDashboard,
      color: "emerald"
    },
    error: {
      icon: <XCircle className="w-20 h-20 text-red-500" />,
      title: "Ops!",
      message: "Algo deu errado no processamento do seu pagamento. Não se preocupe, nenhuma cobrança foi realizada.",
      buttonText: "Tentar Novamente",
      buttonAction: onRetry,
      color: "red"
    },
    pending: {
      icon: <Clock className="w-20 h-20 text-amber-500" />,
      title: "Pagamento Pendente",
      message: "Estamos aguardando a confirmação do seu pagamento (Boleto ou Pix) para liberar seu acesso. Isso pode levar até 24h.",
      buttonText: "Voltar ao Início",
      buttonAction: onGoToDashboard,
      color: "amber"
    }
  };

  const current = configs[status];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 border border-slate-100 shadow-2xl text-center space-y-8">
        <div className="flex justify-center animate-bounce duration-[2000ms]">
          {current.icon}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{current.title}</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            {current.message}
          </p>
        </div>

        <button 
          onClick={current.buttonAction}
          className={`w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95`}
        >
          {status === 'error' ? <CreditCard className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
          {current.buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="pt-4 flex items-center justify-center gap-2 opacity-30 grayscale pointer-events-none">
          <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className="h-4" alt="MP" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Pagamento 100% Seguro</span>
        </div>
      </div>
    </div>
  );
};
