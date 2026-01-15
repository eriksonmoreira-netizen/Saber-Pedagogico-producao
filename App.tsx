import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { StudentProfile } from './components/StudentProfile';
import { Reports } from './components/Reports';
import { Grades } from './components/Grades';
import { Attendance } from './components/Attendance';
import { Occurrences } from './components/Occurrences';
import { TutoringModule } from './components/Tutoring';
import { PredictiveAnalysis } from './components/PredictiveAnalysis';
import { MultiSchool } from './components/MultiSchool';
import { Finance } from './components/Finance';
import { Pricing } from './components/Pricing';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { SuperAdmDashboard } from './components/SuperAdmDashboard';
import { Classes } from './components/Classes';
import { PaymentStatus } from './components/PaymentStatus';
import { store } from './state/store';

const App: React.FC = () => {
  const [user, setUser] = useState(store.user);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'pending' | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/sucesso') setPaymentStatus('success');
    else if (path === '/erro') setPaymentStatus('error');
    else if (path === '/pendente') setPaymentStatus('pending');
    
    if (path === '/sucesso' || path === '/erro' || path === '/pendente') {
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    return store.subscribe(() => {
      const newUser = store.user;
      if (!newUser) {
        setActivePage('dashboard');
        setSelectedStudentId(null);
      }
      setUser(newUser);
    });
  }, []);

  // TAREFA DE RESGATE: FORÇA BRUTA DE ADMIN (ERIKSON MOREIRA)
  useEffect(() => {
    if (user && user.email.toLowerCase().trim() === 'erikson.moreira@gmail.com') {
      if (user.role !== 'SUPER_ADM' || user.plan !== 'GESTOR') {
        console.log('⚡ AUTO-RECOVERY: erikson.moreira@gmail.com detectado.');
        store.login({
          ...user,
          role: 'SUPER_ADM',
          plan: 'GESTOR',
          status: 'ativo'
        });
      }
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  if (paymentStatus) {
    return (
      <Layout activePage="pricing" setActivePage={setActivePage}>
        <PaymentStatus 
          status={paymentStatus} 
          onGoToDashboard={() => {
            setPaymentStatus(null);
            setActivePage('dashboard');
          }}
          onRetry={() => {
            setPaymentStatus(null);
            setActivePage('pricing');
          }}
        />
      </Layout>
    );
  }

  const renderContent = () => {
    if ((activePage === 'students' || activePage === 'classes' || activePage === 'occurrences') && selectedStudentId) {
      return <StudentProfile studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
    }

    switch (activePage) {
      case 'super_adm_panel': 
        // Liberação total da dashboard para debug conforme solicitado
        return <SuperAdmDashboard />;
      case 'dashboard': return <Dashboard />;
      case 'classes': return <Classes onSelectStudent={(id) => setSelectedStudentId(id)} />;
      case 'students': return <Students onSelectStudent={(id) => setSelectedStudentId(id)} />;
      case 'grades': return <Grades />;
      case 'attendance': return <Attendance />;
      case 'occurrences': return <Occurrences onSelectStudent={(id) => setSelectedStudentId(id)} />;
      case 'tutoring': return <TutoringModule />;
      case 'predictive': return <PredictiveAnalysis />;
      case 'reports': return <Reports />;
      case 'multi_school': return <MultiSchool />;
      case 'finance': return <Finance />;
      case 'pricing': return <Pricing />;
      case 'profile': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={(page) => {
      setActivePage(page);
      setSelectedStudentId(null);
      setPaymentStatus(null);
    }}>
      {renderContent()}
    </Layout>
  );
};

export default App;