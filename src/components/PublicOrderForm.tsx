import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Upload, Check, Cake, MessageCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from './ui/utils';
import { api } from '../lib/api';
import { ImageZoom } from './ui/ImageZoom';
import { toast } from 'sonner';
import turronImage from '../assets/f5fd82509aa844458a9987489ff3dc63ac9314e7.png';
import fondantImage from '../assets/0546f288cc45540200ba187c6f98e672c890ef6c.png';
import betunImage from '../assets/d9437422728e1c5a0ff4c628c8a3f11c480e7d8f.png';

console.log('PublicOrderForm component loaded');

const CAKE_TYPES = [
  {
    id: 'turron',
    name: 'Turrón (Merengue)',
    description: 'Base de claras de huevo',
    image: turronImage,
  },
  {
    id: 'betun',
    name: 'Betún',
    description: 'Crema mantequilla',
    image: betunImage,
  },
  {
    id: 'fondant',
    name: 'Fondant',
    description: 'Cobertura suave y lisa',
    image: fondantImage,
  },
];

const CAKE_SIZES = [5, 10, 15, 20, 25, 30, 40, 50, 70, 100, 200];

export default function PublicOrderForm() {
  console.log('PublicOrderForm rendering');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerLastName: '',
    customerPhone: '',
    cakeType: '',
    cakeSize: 0,
    customSize: '',
    decoration: '',
    color: '',
    flavor: '',
    deliveryDate: undefined as Date | undefined,
    deliveryTime: '',
    notes: '',
  });

  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + referenceImages.length > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }

    setReferenceImages([...referenceImages, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const generateWhatsAppMessage = () => {
    const size = formData.customSize || `${formData.cakeSize} personas`;
    const date = formData.deliveryDate 
      ? format(formData.deliveryDate, "dd 'de' MMMM, yyyy", { locale: es })
      : 'No especificada';
    
    return encodeURIComponent(
      `🎂 *NUEVO PEDIDO DE PASTEL*\n\n` +
      `👤 Cliente: ${formData.customerName} ${formData.customerLastName}\n` +
      `📱 Teléfono: ${formData.customerPhone}\n\n` +
      `🍰 Tipo: ${CAKE_TYPES.find(t => t.id === formData.cakeType)?.name || 'No especificado'}\n` +
      `👥 Tamaño: ${size}\n` +
      `🎨 Decoración: ${formData.decoration || 'No especificada'}\n` +
      `🌈 Color: ${formData.color || 'No especificado'}\n` +
      `😋 Sabor: ${formData.flavor || 'No especificado'}\n\n` +
      `📅 Entrega: ${date}\n` +
      `🕐 Hora: ${formData.deliveryTime || 'No especificada'}\n\n` +
      `📝 Notas: ${formData.notes || 'Ninguna'}\n\n` +
      `✅ Pedido registrado en el sistema`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Por favor completa tu nombre y teléfono');
      return;
    }

    if (!formData.cakeType) {
      toast.error('Por favor selecciona el tipo de cobertura');
      return;
    }

    if (formData.cakeSize === 0 && !formData.customSize) {
      toast.error('Por favor selecciona el tamaño del pastel');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert images to base64
      const imagePromises = referenceImages.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const imagesBase64 = await Promise.all(imagePromises);

      // Enviar pedido al backend
      const response = await api.post('/public-order', {
        customer: {
          name: formData.customerName,
          lastName: formData.customerLastName,
          phone: formData.customerPhone,
        },
        order: {
          cakeType: formData.cakeType,
          cakeSize: formData.customSize || `${formData.cakeSize} personas`,
          decoration: formData.decoration,
          color: formData.color,
          flavor: formData.flavor,
          deliveryDate: formData.deliveryDate?.toISOString(),
          deliveryTime: formData.deliveryTime,
          notes: formData.notes,
          referenceImages: imagesBase64,
        },
      });

      if (response.success) {
        setOrderCreated(true);
        toast.success('¡Pedido enviado exitosamente!');

        // Abrir WhatsApp después de 1 segundo
        setTimeout(() => {
          const message = generateWhatsAppMessage();
          window.open(`https://wa.me/50239007409?text=${message}`, '_blank');
        }, 1000);
      } else {
        throw new Error(response.error || 'Error al crear pedido');
      }
    } catch (error) {
      console.error('Error creating public order:', error);
      toast.error('Error al enviar el pedido. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl mb-2">¡Pedido Enviado!</h2>
            <p className="text-gray-600">
              Tu pedido ha sido registrado exitosamente. En breve nos comunicaremos contigo para confirmar los detalles y el precio.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Hacer Otro Pedido
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <Cake className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-3xl mb-2">Haz tu Pedido</h1>
          <p className="text-gray-600">
            Completa el formulario y nos pondremos en contacto contigo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos del Cliente */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">📋 Tus Datos</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Nombre *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerLastName">Apellido</Label>
                <Input
                  id="customerLastName"
                  value={formData.customerLastName}
                  onChange={(e) => setFormData({ ...formData, customerLastName: e.target.value })}
                  placeholder="Tu apellido"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Teléfono / WhatsApp *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Ej: +1234567890"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Tipo de Cobertura */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">🎨 Tipo de Cobertura *</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CAKE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, cakeType: type.id })}
                  className={cn(
                    "relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                    formData.cakeType === type.id
                      ? "border-pink-500 ring-2 ring-pink-500"
                      : "border-gray-200"
                  )}
                >
                  <div className="aspect-square">
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="font-semibold">{type.name}</div>
                    <div className="text-sm opacity-90">{type.description}</div>
                  </div>
                  {formData.cakeType === type.id && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Tamaño */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">👥 Tamaño / Personas *</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
              {CAKE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({ ...formData, cakeSize: size, customSize: '' })}
                  className={cn(
                    "aspect-square rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center",
                    formData.cakeSize === size
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 hover:border-pink-300"
                  )}
                >
                  <span className="text-2xl">{size}</span>
                  <span className="text-xs mt-1">personas</span>
                </button>
              ))}
            </div>
            <div>
              <Label htmlFor="customSize">O especifica otro tamaño</Label>
              <Input
                id="customSize"
                value={formData.customSize}
                onChange={(e) => setFormData({ ...formData, customSize: e.target.value, cakeSize: 0 })}
                placeholder="Ej: 35 personas, 1/2 libra, etc."
              />
            </div>
          </Card>

          {/* Detalles del Pastel */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">🍰 Detalles del Pastel</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="decoration">Decoración Deseada</Label>
                <Input
                  id="decoration"
                  value={formData.decoration}
                  onChange={(e) => setFormData({ ...formData, decoration: e.target.value })}
                  placeholder="Ej: Flores, unicornio, superhéroes..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color Principal</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ej: Rosa, azul..."
                  />
                </div>
                <div>
                  <Label htmlFor="flavor">Sabor</Label>
                  <Input
                    id="flavor"
                    value={formData.flavor}
                    onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                    placeholder="Ej: Chocolate, vainilla..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Cualquier detalle adicional que quieras agregar..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Fotos de Referencia */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">📸 Fotos de Referencia</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sube hasta 5 fotos que te inspiren para tu pastel
            </p>
            <div className="space-y-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <ImageZoom
                        src={preview}
                        alt={`Referencia ${index + 1}`}
                        className="w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {imagePreviews.length < 5 && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-pink-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Toca para subir imágenes
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    ({imagePreviews.length}/5)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </Card>

          {/* Fecha y Hora de Entrega */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">📅 Fecha y Hora de Entrega</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryDate">Fecha</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate ? format(formData.deliveryDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                    setFormData({ ...formData, deliveryDate: date });
                  }}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="deliveryTime">Hora</Label>
                <Input
                  id="deliveryTime"
                  type="time"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar Pedido por WhatsApp
              </>
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Al enviar tu pedido, recibirás confirmación por WhatsApp con los detalles y precio
          </p>
        </form>
      </div>
    </div>
  );
}
