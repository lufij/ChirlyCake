import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { InitialSetup } from './components/InitialSetup';
import PublicOrderForm from './components/PublicOrderForm';
import TestPublicForm from './components/TestPublicForm';
import { PWAHead } from './components/PWAHead';
import { PWAInstaller } from './components/PWAInstaller';
import { getProfile, setAuthToken } from './lib/api';
import { supabase } from './lib/supabase';
import { Toaster } from 'sonner@2.0.3';
import { Loader2 } from 'lucide-react';
import { projectId } from './utils/supabase/info';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [, forceUpdate] = useState(0); // Para forzar re-render cuando cambia el hash
  
  // Leer hash directamente en cada render
  const currentHash = window.location.hash;
  const isPublicOrderPage = currentHash === '#/pedido' || currentHash === '#pedido';
  
  console.log('🔄 App rendering - hash:', currentHash, 'isPublic:', isPublicOrderPage, 'loading:', loading);

  useEffect(() => {
    console.log('🚀 App mounted, hash:', window.location.hash);
    
    // Si estamos en la página pública, solo seteamos loading a false
    if (window.location.hash === '#/pedido' || window.location.hash === '#pedido') {
      console.log('✅ Public order page detected - setting loading to false');
      setLoading(false);
    } else {
      console.log('🔍 Running checkSetup...');
      checkSetup();
    }
    
    // Escuchar cambios de hash
    const handleHashChange = () => {
      console.log('🔀 Hash changed to:', window.location.hash);
      forceUpdate(n => n + 1); // Forzar re-render
      
      // Si navegamos a la página pública, setear loading a false
      if (window.location.hash === '#/pedido' || window.location.hash === '#pedido') {
        setLoading(false);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Configurar listener de cambios de autenticación de Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event, 'has session:', !!session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in, updating token and profile');
        setAuthToken(session.access_token);
        await updateUserProfile();
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out, clearing state');
        setAuthToken(null);
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 Token refreshed, updating token');
        setAuthToken(session.access_token);
      } else if (event === 'USER_UPDATED' && session) {
        console.log('👤 User updated, refreshing profile');
        setAuthToken(session.access_token);
        await updateUserProfile();
      }
    });
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const updateUserProfile = async () => {
    try {
      const data = await getProfile();
      console.log('📝 Profile updated:', data.user);
      setUser(data.user);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setUser(null);
    }
  };

  const checkSetup = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95aa99a4/check-setup`
      );
      const data = await response.json();
      
      if (data.needsSetup) {
        setNeedsSetup(true);
        setLoading(false);
        return;
      }

      await checkAuth();
    } catch (error) {
      console.error('Setup check failed:', error);
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session check error:', error);
        setLoading(false);
        return;
      }

      if (session?.access_token) {
        console.log('✅ Found existing session, loading profile');
        setAuthToken(session.access_token);
        await updateUserProfile();
      } else {
        console.log('ℹ️ No existing session found');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    setLoading(false);
  };

  const handleLoginSuccess = async () => {
    // La actualización del perfil se manejará automáticamente por el listener
    console.log('🎉 Login successful, waiting for auth state change...');
  };

  const handleLogout = async () => {
    try {
      console.log('👋 Logging out...');
      await supabase.auth.signOut();
      setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Limpiar estado de todos modos
      setAuthToken(null);
      setUser(null);
    }
  };

  // ========== RENDERING LOGIC ==========
  
  // 1. ALWAYS check for public order page FIRST (even if loading)
  if (isPublicOrderPage) {
    console.log('✅ RENDERING PUBLIC ORDER FORM');
    return (
      <div className="size-full">
        <PWAHead />
        <Toaster position="top-center" richColors />
        <PublicOrderForm />
      </div>
    );
  }

  // 2. Show loading screen
  if (loading) {
    console.log('⏳ RENDERING LOADING');
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600 mx-auto mb-2" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // 3. Show main app
  console.log('📄 RENDERING MAIN APP - needsSetup:', needsSetup, 'user:', !!user);
  return (
    <div className="size-full">
      <PWAHead />
      <Toaster position="top-center" richColors />
      <PWAInstaller />
      {needsSetup ? (
        <InitialSetup onComplete={handleSetupComplete} />
      ) : user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}