import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supaBaseClient.js';
import Login from './components/Login';
import PainelVendas from './components/PainelVendas';
import AdminPainel from './components/AdminPainel';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe(); // <-- corrigido aqui
    };
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/vendas" replace />}
        />
        <Route
          path="/vendas"
          element={session ? <PainelVendas /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={session ? <AdminPainel /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={session ? "/vendas" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
