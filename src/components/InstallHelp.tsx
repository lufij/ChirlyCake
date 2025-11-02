import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Smartphone, 
  Chrome, 
  Download, 
  CheckCircle2, 
  QrCode,
  HelpCircle,
  Share2,
  Menu,
  ChevronRight
} from 'lucide-react';
import { QRInstaller } from './QRInstaller';
import { InstallGuide } from './InstallGuide';

export function InstallHelp() {
  const [showGuide, setShowGuide] = useState(false);
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Instala la App en tu Tableta</h1>
        <p className="text-gray-600">
          Convierte esta web en una aplicación para usar sin abrir el navegador
        </p>
      </div>

      {/* Status Card */}
      {isInstalled ? (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">¡App ya instalada! 🎉</h3>
              <p className="text-sm text-green-700">
                Estás usando la versión instalada de Pastelería Pro
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">App no instalada</h3>
              <p className="text-sm text-blue-700">
                Estás usando la versión web. ¡Instálala para mejor experiencia!
              </p>
            </div>
          </div>
          <Button onClick={() => setShowGuide(true)} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Ver Tutorial de Instalación
          </Button>
        </Card>
      )}

      {/* Benefits */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-pink-600" />
          Beneficios de Instalar la App
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="font-medium">Acceso Rápido</p>
              <p className="text-sm text-gray-600">Icono en tu pantalla de inicio</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="font-medium">Pantalla Completa</p>
              <p className="text-sm text-gray-600">Sin barra de navegador</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="font-medium">Más Rápida</p>
              <p className="text-sm text-gray-600">Cache local inteligente</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="font-medium">Funciona Offline</p>
              <p className="text-sm text-gray-600">Consulta sin internet</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Instructions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Chrome className="w-5 h-5 text-blue-600" />
          Instrucciones Rápidas
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                <Menu className="w-4 h-4" />
                Abre el menú de Chrome
              </p>
              <p className="text-sm text-gray-600">
                Toca los 3 puntos (⋮) en la esquina superior derecha
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Selecciona "Agregar a pantalla de inicio"
              </p>
              <p className="text-sm text-gray-600">
                O "Instalar app" si aparece esa opción
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Confirma presionando "Agregar"
              </p>
              <p className="text-sm text-gray-600">
                El icono aparecerá en tu pantalla de inicio
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => setShowGuide(true)} 
          variant="outline" 
          className="w-full mt-4"
        >
          Ver Tutorial Visual Paso a Paso
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </Card>

      {/* QR Code Section */}
      <QRInstaller />

      {/* FAQ */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gray-600" />
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">¿Necesito descargarla de Google Play?</p>
            <p className="text-sm text-gray-600">
              No, se instala directamente desde el navegador. No requiere tiendas de apps.
            </p>
          </div>
          <div>
            <p className="font-medium">¿Funciona sin internet?</p>
            <p className="text-sm text-gray-600">
              Parcialmente. Puedes ver datos previamente cargados, pero necesitas internet para crear/editar pedidos.
            </p>
          </div>
          <div>
            <p className="font-medium">¿Cómo actualizo la app?</p>
            <p className="text-sm text-gray-600">
              Automáticamente. Solo cierra y vuelve a abrir para obtener la última versión.
            </p>
          </div>
          <div>
            <p className="font-medium">¿Puedo instalarla en varios dispositivos?</p>
            <p className="text-sm text-gray-600">
              Sí, instala en todas las tabletas que necesites. Todos se sincronizarán con la misma base de datos.
            </p>
          </div>
        </div>
      </Card>

      {/* Share Section */}
      <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Share2 className="w-12 h-12 text-pink-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Comparte con tu Equipo</h3>
          <p className="text-sm text-gray-600 mb-4">
            Todos los miembros de tu equipo pueden instalar la app en sus dispositivos
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => {
              const url = window.location.origin;
              navigator.clipboard.writeText(url);
            }}>
              Copiar URL
            </Button>
            <Button variant="outline" size="sm" onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: 'Pastelería Pro',
                  url: window.location.origin
                });
              }
            }}>
              Compartir
            </Button>
          </div>
        </div>
      </Card>

      {showGuide && <InstallGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}
