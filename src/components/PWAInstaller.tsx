import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Download, X, HelpCircle, Smartphone } from 'lucide-react';

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    // Registrar el service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registrado correctamente:', registration.scope);
          })
          .catch((error) => {
            console.log('Error al registrar Service Worker:', error);
          });
      });
    }

    // Capturar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e);
      // Mostrar nuestro botón de instalación
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA ya está instalada');
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  const handleShowManual = () => {
    setShowManualInstructions(true);
  };

  if (!showInstallPrompt) return null;

  if (showManualInstructions) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Instalación Manual</h3>
              <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
                <li>Toca los <strong>3 puntos (⋮)</strong> arriba a la derecha</li>
                <li>Selecciona <strong>"Agregar a pantalla de inicio"</strong></li>
                <li>Presiona <strong>"Agregar"</strong> para confirmar</li>
                <li>¡Listo! Abre la app desde tu pantalla de inicio</li>
              </ol>
              <div className="flex gap-2 mt-3">
                <Button 
                  onClick={() => setShowManualInstructions(false)} 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                >
                  Entendido
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <Download className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Instalar Pastelería Pro</h3>
            <p className="text-sm text-gray-600 mt-1">
              Instala la aplicación en tu tableta para acceso rápido y uso sin conexión
            </p>
            <div className="space-y-2 mt-3">
              <div className="flex gap-2">
                <Button onClick={handleInstallClick} size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Instalar Ahora
                </Button>
                <Button onClick={handleDismiss} variant="ghost" size="sm">
                  Ahora no
                </Button>
              </div>
              <button
                onClick={handleShowManual}
                className="w-full text-xs text-center text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                ¿No aparece el botón? Ver instrucciones manuales
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
