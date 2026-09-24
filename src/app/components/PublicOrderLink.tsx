import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Share2, Copy, QrCode, MessageCircle, ExternalLink, Cake } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '../lib/clipboard';

export function PublicOrderLink() {
  const [showDialog, setShowDialog] = useState(false);
  const publicLink = `${window.location.origin}/#/pedido`;

  const copyLink = async () => {
    const success = await copyToClipboard(publicLink);
    if (success) {
      toast.success('Link copiado al portapapeles');
    } else {
      toast.error('No se pudo copiar el link');
    }
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Hola! 🎂\n\n` +
      `Puedes hacer tu pedido de pastel directamente desde este enlace:\n\n` +
      `${publicLink}\n\n` +
      `Es rápido, fácil y seguro. ¡Esperamos tu pedido! 🍰`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const openPreview = () => {
    window.open(publicLink, '_blank');
  };

  const navigateToForm = () => {
    window.location.hash = '#/pedido';
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className="gap-2 bg-purple-50 hover:bg-purple-100 border-purple-300"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Link de Pedidos</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Link Público de Pedidos</DialogTitle>
            <DialogDescription>
              Comparte este link con tus clientes para que hagan sus pedidos directamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Link Display */}
            <div className="p-3 bg-gray-100 rounded-lg break-all text-sm">
              {publicLink}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={copyLink}
                variant="outline"
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>

              <Button
                onClick={openPreview}
                variant="outline"
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Nueva Tab
              </Button>

              <Button
                onClick={navigateToForm}
                variant="default"
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Cake className="w-4 h-4" />
                Ir Ahora
              </Button>
            </div>

            <Button
              onClick={shareWhatsApp}
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4" />
              Compartir por WhatsApp
            </Button>

            {/* Instructions */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-sm text-purple-900 mb-2">
                💡 ¿Cómo funciona?
              </h4>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• El cliente completa el formulario desde su celular</li>
                <li>• Se crea automáticamente como cliente en tu sistema</li>
                <li>• El pedido aparece como "Pendiente Confirmación"</li>
                <li>• Tú agregas el precio y detalles finales</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}