import { useState } from 'react';
import { X, Smartphone, Download, CheckCircle2, QrCode, Chrome, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface InstallGuideProps {
  onClose: () => void;
}

export function InstallGuide({ onClose }: InstallGuideProps) {
  const [step, setStep] = useState(0);
  
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

  const steps = [
    {
      icon: Smartphone,
      title: "¡Convierte esta web en una App!",
      description: "Instala Pastelería Pro en tu tableta y úsala como una aplicación nativa",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      icon: Chrome,
      title: "Paso 1: Abre el Menú de Chrome",
      description: "Toca los 3 puntos (⋮) en la esquina superior derecha del navegador",
      visual: (
        <div className="mt-4 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex justify-end mb-2">
            <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-lg shadow-lg border-2 border-pink-500 animate-pulse">
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              <span className="text-xs mt-1">← Toca aquí</span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">Esquina superior derecha</div>
        </div>
      ),
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Download,
      title: "Paso 2: Selecciona 'Agregar a Pantalla de Inicio'",
      description: "En el menú que aparece, busca y toca la opción 'Agregar a pantalla de inicio' o 'Instalar app'",
      visual: (
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-gray-50 rounded border text-sm">Nueva pestaña</div>
          <div className="p-3 bg-gray-50 rounded border text-sm">Nueva pestaña de incógnito</div>
          <div className="p-3 bg-pink-100 rounded border-2 border-pink-500 text-sm flex items-center gap-2 animate-pulse">
            <Download className="w-4 h-4" />
            <span className="font-semibold">Agregar a pantalla de inicio</span>
          </div>
          <div className="p-3 bg-gray-50 rounded border text-sm">Marcadores</div>
          <div className="p-3 bg-gray-50 rounded border text-sm">Historial</div>
        </div>
      ),
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: CheckCircle2,
      title: "Paso 3: Confirma la Instalación",
      description: "Presiona 'Agregar' o 'Instalar' en el diálogo que aparece",
      visual: (
        <div className="mt-4 p-6 bg-white rounded-lg shadow-lg border">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-2xl">
              🧁
            </div>
            <p className="font-semibold">Pastelería Pro</p>
            <p className="text-sm text-gray-600">¿Agregar a pantalla de inicio?</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 border rounded text-sm">Cancelar</button>
            <button className="flex-1 px-4 py-2 bg-pink-600 text-white rounded text-sm animate-pulse border-2 border-pink-700">
              Agregar ✓
            </button>
          </div>
        </div>
      ),
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: CheckCircle2,
      title: "¡Listo! 🎉",
      description: "El icono de Pastelería Pro aparecerá en tu pantalla de inicio. Ábrelo desde ahí para usarlo como app.",
      visual: (
        <div className="mt-4 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col items-center gap-1 opacity-30">
              <div className="w-14 h-14 bg-gray-400 rounded-xl"></div>
              <span className="text-xs">App</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-30">
              <div className="w-14 h-14 bg-gray-400 rounded-xl"></div>
              <span className="text-xs">App</span>
            </div>
            <div className="flex flex-col items-center gap-1 animate-bounce">
              <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                🧁
              </div>
              <span className="text-xs font-semibold">Pastelería</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-30">
              <div className="w-14 h-14 bg-gray-400 rounded-xl"></div>
              <span className="text-xs">App</span>
            </div>
          </div>
          <p className="text-center text-sm font-medium text-pink-700">
            ¡Toca el icono para abrir la app! 👆
          </p>
        </div>
      ),
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ];

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  if (isInstalled) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">¡Ya está instalada! 🎉</h2>
            <p className="text-gray-600 mb-6">
              La aplicación ya está instalada en tu dispositivo. Estás usando la versión de app nativa.
            </p>
            <Button onClick={onClose} className="w-full">
              Entendido
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-lg w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex gap-1 mb-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx <= step ? 'bg-pink-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Paso {step + 1} de {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 ${currentStep.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <StepIcon className={`w-8 h-8 ${currentStep.color}`} />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">{currentStep.title}</h2>
          <p className="text-gray-600">{currentStep.description}</p>
          
          {currentStep.visual && (
            <div className="mt-4">
              {currentStep.visual}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Anterior
            </Button>
          )}
          
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Cerrar Tutorial
            </Button>
          )}
        </div>

        {/* Skip Link */}
        {step < steps.length - 1 && (
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-3"
          >
            Ya sé cómo instalar
          </button>
        )}
      </Card>
    </div>
  );
}
