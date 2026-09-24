import { useState, useEffect } from 'react';
import { Smartphone, X, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { InstallGuide } from './InstallGuide';

export function InstallBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    const installed = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(installed);

    // Verificar si ya fue descartado antes
    const wasDismissed = localStorage.getItem('installBannerDismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  const handleShowGuide = () => {
    setShowGuide(true);
  };

  // No mostrar si ya está instalada o fue descartada
  if (isInstalled || dismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base">
                ¿Usas una tableta? ¡Instala esta app!
              </p>
              <p className="text-xs sm:text-sm text-white/90">
                Úsala como app nativa sin abrir el navegador
              </p>
            </div>

            <Button
              onClick={handleShowGuide}
              variant="secondary"
              size="sm"
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">Ver cómo</span>
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </Button>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-white/80 hover:text-white ml-2"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showGuide && <InstallGuide onClose={() => setShowGuide(false)} />}
    </>
  );
}
