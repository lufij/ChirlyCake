import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { InitialSetup } from './components/InitialSetup';
import PublicOrderForm from './components/PublicOrderForm';
import TestPublicForm from './components/TestPublicForm';
import { PWAHead } from './components/PWAHead';
import { PWAInstaller } from './components/PWAInstaller';
import { getProfile, getAuthToken } from './lib/api';
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
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    checkAuth();
  };

  const handleLogout = () => {
    setUser(null);
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
