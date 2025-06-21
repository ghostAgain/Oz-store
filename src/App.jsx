import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supaBaseClient.js';
import Login from './components/Login.jsx';
import AdminPainel from './components/AdminPainel.jsx';
import Loja from './components/Loja.jsx';

const ADMIN_EMAIL = 'eduardogatti15@gmail.com';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to={isAdmin ? '/admin' : '/loja'} replace />}
        />
        <Route
          path="/admin"
          element={session && isAdmin ? <AdminPainel /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/loja"
          element={session && !isAdmin ? <Loja /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={session ? (isAdmin ? '/admin' : '/loja') : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
