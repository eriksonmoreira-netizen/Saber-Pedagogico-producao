
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { store } from './state/store';

const App: React.FC = () => {
  const [user, setUser] = useState(store.user);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    return store.subscribe(() => {
      setUser(store.user);
    });
  }, []);

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderContent()}
    </Layout>
  );
};

export default App;
