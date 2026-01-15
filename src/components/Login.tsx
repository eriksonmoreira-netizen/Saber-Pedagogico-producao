
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  Mail,
  Lock,
  ArrowRight,
  UserPlus,
  User as UserIcon,
  ChevronLeft,
  Chrome,
  Zap,
  Star,
  Crown,
  Building
} from 'lucide-react';
import { store } from '../state/store';

const PLAN_SLIDES = [
  {
    plan: "SEMENTE",
    title: "Comece sua Jornada Grátis",
    highlight: "Semente",
    icon: <Zap className="w-8 h-8 text-indigo-200" />,
    features: [
      "Diário de classe 100% digital",
      "Gestão de até 5 turmas",
      "Chamada rápida com um clique",
      "Lançamento de notas simplificado"
    ]
  },
  {
    plan: "DOCENTE",
    title: "Organização Profissional",
    highlight: "Docente",
    icon: <Star className="w-8 h-8 text-indigo-200" />,
    features: [
      "Turmas ilimitadas para sua rotina",
      "Módulo completo de Tutoria e PDI",
      "Registro de Ocorrências detalhado",
      "Exportação de relatórios em PDF"
    ]
  },
  {
    plan: "MESTRE",
    title: "Poder da Inteligência Artificial",
    highlight: "Mestre",
    icon: <Crown className="w-8 h-8 text-indigo-200" />,
    features: [
      "Planos de Aula gerados por IA Gemini",
      "Análise Preditiva de desempenho",
      "Insights automáticos sobre alunos",
      "Relatórios analíticos avançados"
    ]
  },
  {
    plan: "PLUS",
    title: "Para Professores Multi-Escola",
    highlight: "Mestre Plus",
    icon: <Building className="w-8 h-8 text-indigo-200" />,
    features: [
      "Gestão de múltiplas instituições",
      "Painel financeiro integrado",
      "Ambientes de trabalho isolados",
      "Suporte prioritário 24/7"
    ]
  }
];

export const Login: React.FC = () => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('erikson.moreira@gmail.com');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('Erikson Moreira');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PLAN_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, preencha o e-mail.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // Simulação de delay de rede (Static Mode)
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // MODO ESTÁTICO: Apenas salva no LocalStorage via Store
      store.login({
        full_name: fullName || email.split('@')[0],
        email: email,
        photo_url: `https://ui-avatars.com/api/?name=${fullName || email}&background=6366f1&color=fff`,
        id: 'user-' + Date.now(),
        // Lógica mantida: Erikson é Admin
        role: email.toLowerCase() === 'erikson.moreira@gmail.com' ? 'SUPER_ADM' : 'TEACHER',
        plan: email.toLowerCase() === 'erikson.moreira@gmail.com' ? 'GESTOR' : 'SEMENTE',
        status: 'ativo',
        created_at: new Date().toISOString()
      });
    } catch (err) {
      setError("Erro ao autenticar localmente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden">
      <div className="lg:w-1/2 bg-indigo-600 p-12 flex flex-col justify-between text-white relative overflow-hidden transition-all duration-700">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 rounded-full -ml-20 -mb-20 blur-3xl" />
        
        <div className="relative z-10">
          <div className="leading-none">
            <span className="text-5xl font-black tracking-tighter uppercase italic block leading-none">Saber</span>
            <span className="text-base font-bold text-indigo-200 uppercase tracking-[0.4em] block leading-none mt-2">Pedagógico</span>
          </div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div key={currentSlide} className="animate-fade-in space-y-8">
             <div className="flex items-center gap-3 opacity-60">
               {PLAN_SLIDES[currentSlide].icon}
               <span className="font-black text-[10px] uppercase tracking-[0.4em]">PLANO {PLAN_SLIDES[currentSlide].plan}</span>
             </div>
             
             <div className="space-y-4">
               <h2 className="text-3xl font-bold leading-tight tracking-tight text-indigo-100">
                 {PLAN_SLIDES[currentSlide].title}
               </h2>
               <h1 className="text-7xl font-black leading-none tracking-tighter text-white">
                 {PLAN_SLIDES[currentSlide].highlight}
               </h1>
             </div>

             <div className="space-y-4 pt-4">
                {PLAN_SLIDES[currentSlide].features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="p-1 bg-white/10 rounded-full shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-indigo-200" />
                    </div>
                    <p className="text-indigo-50 text-base font-medium">{feature}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex gap-1.5">
            {PLAN_SLIDES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-white' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2 text-indigo-200/50 text-[10px] font-black uppercase tracking-[0.3em]">
            <ShieldCheck className="w-4 h-4" /> Versão Estática • v5.0
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-12">
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {authMode === 'LOGIN' ? 'Bem-vindo!' : 'Crie sua conta'}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              {authMode === 'LOGIN' 
                ? 'Acesse seu painel pedagógico offline.' 
                : 'Cadastre-se hoje e ganhe acesso ao plano Semente.'}
            </p>
          </div>

          <div className="p-8 md:p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner space-y-8 relative">
            
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authMode === 'REGISTER' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Como quer ser chamado?"
                      className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha</label>
                  {authMode === 'LOGIN' && (
                    <button type="button" className="text-[10px] font-bold text-indigo-600 hover:underline uppercase">Esqueceu?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-70 mt-6 active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {authMode === 'LOGIN' ? <ArrowRight className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    {authMode === 'LOGIN' ? 'Entrar no Sistema' : 'Cadastrar-me agora'}
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button 
                onClick={() => {
                  setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                  setError(null);
                }}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-all group"
              >
                {authMode === 'LOGIN' ? (
                  <>Não tem conta? <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 group-hover:decoration-indigo-600">Cadastre-se grátis</span></>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <ChevronLeft className="w-3 h-3" /> Já possui uma conta? Voltar ao Login
                  </div>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-3xl flex gap-3 text-red-600 text-sm font-medium animate-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-center items-center gap-8 opacity-30 grayscale pointer-events-none">
             <div className="font-black text-slate-900 text-[9px] tracking-[0.2em]">LOCAL STORAGE</div>
             <div className="font-black text-slate-900 text-[9px] tracking-[0.2em]">OFFLINE MODE</div>
          </div>
        </div>
      </div>
    </div>
  );
};
