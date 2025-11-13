import { useState } from 'react';
import { QrCode, Copy, Check, Share2, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../lib/clipboard';

export function QRInstaller() {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.origin;

  // Generar URL del QR usando API pública
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

  const copyUrl = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      setCopied(true);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('No se pudo copiar la URL');
    }
  };

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pastelería Pro',
          text: 'Instala nuestra app de gestión de pastelería',
          url: currentUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          copyUrl();
        }
      }
    } else {
      copyUrl();
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'pasteleria-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Código QR descargado');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-pink-600" />
        <h3 className="font-semibold">Comparte la Instalación</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Escanea este código QR desde otra tableta para instalar la app rápidamente
      </p>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 flex justify-center">
        <img 
          src={qrCodeUrl} 
          alt="QR Code para instalar app"
          className="w-48 h-48"
        />
      </div>

      {/* URL Display */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4 flex items-center gap-2">
        <code className="text-sm text-gray-700 flex-1 truncate">
          {currentUrl}
        </code>
        <button
          onClick={copyUrl}
          className="flex-shrink-0 p-2 hover:bg-gray-200 rounded transition-colors"
          title="Copiar URL"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={shareUrl}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Compartir
        </Button>
        <Button
          variant="outline"
          onClick={downloadQR}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar QR
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Imprime este QR y pégalo en tu local para que el equipo pueda instalar fácilmente
        </p>
      </div>
    </Card>
  );
}