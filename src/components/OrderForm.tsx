import { useState, useEffect } from 'react';
import { Order, Customer, createOrder, updateOrder, uploadImage, createCustomer } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { X, Upload, Loader2 } from 'lucide-react';

interface OrderFormProps {
  order?: Order | null;
  customers: Customer[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function OrderForm({ order, customers, onSuccess, onCancel }: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Get customer data if editing an order
  const existingCustomer = order ? customers.find(c => c.id === order.customerId) : null;
  
  const [formData, setFormData] = useState({
    customerName: existingCustomer?.name || '',
    customerPhone: existingCustomer?.phone || '',
    deliveryDate: order?.deliveryDate || '',
    deliveryTime: order?.deliveryTime || '',
    description: order?.description || '',
    totalPrice: order?.totalPrice?.toString() || '',
    advance: order?.advance?.toString() || '0',
    status: order?.status || 'pendiente',
    paymentStatus: order?.paymentStatus || 'pendiente',
  });

  const [images, setImages] = useState<string[]>(order?.images || []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(r => r.url);
      setImages(prev => [...prev, ...newImageUrls]);
      toast.success('Imágenes subidas correctamente');
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error('Error al subir las imágenes');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.deliveryDate || !formData.deliveryTime || !formData.description || !formData.totalPrice) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      let customerId: string;
      
      if (order) {
        // If editing, use the existing customer ID (could update customer data here if needed)
        customerId = order.customerId;
      } else {
        // Check if customer with this phone AND name already exists
        const existingCustomer = customers.find(
          c => c.phone === formData.customerPhone && c.name.toLowerCase() === formData.customerName.toLowerCase()
        );
        
        if (existingCustomer) {
          // Found exact match (same phone and name)
          customerId = existingCustomer.id;
        } else {
          // Create new customer (even if phone exists but with different name)
          const result = await createCustomer({
            name: formData.customerName,
            phone: formData.customerPhone,
            email: '',
            address: '',
          });
          customerId = result.customer.id;
        }
      }

      const totalPrice = parseFloat(formData.totalPrice);
      const advance = parseFloat(formData.advance);

      // Auto-calculate payment status based on advance
      let paymentStatus: Order['paymentStatus'];
      if (advance === 0) {
        paymentStatus = 'pendiente';
      } else if (advance >= totalPrice) {
        paymentStatus = 'pagado';
      } else {
        paymentStatus = 'anticipo_recibido';
      }

      const orderData = {
        customerId,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        description: formData.description,
        totalPrice,
        advance,
        status: order ? formData.status : 'pendiente', // Use form status if editing, otherwise default to pendiente
        paymentStatus: order ? formData.paymentStatus : paymentStatus, // Use form status if editing, otherwise calculate
        images,
      };

      if (order) {
        await updateOrder(order.id, orderData);
        toast.success('Pedido actualizado correctamente');
      } else {
        await createOrder(orderData);
        toast.success('Pedido creado correctamente');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast.error(error.message || 'Error al guardar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nombre del Cliente *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder="Ej: María García"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Teléfono *</Label>
          <Input
            id="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            placeholder="Ej: 71234567"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deliveryDate">Fecha de Entrega *</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryTime">Hora *</Label>
          <Input
            id="deliveryTime"
            type="time"
            value={formData.deliveryTime}
            onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción del Pastel *</Label>
        <Textarea
          id="description"
          placeholder="Sabor, relleno, cobertura, decoraciones, etc."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Imágenes de Referencia</Label>
        <div className="border-2 border-dashed rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={uploadingImage}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              {uploadingImage ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm">Subiendo imágenes...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8" />
                  <p className="text-sm">Haz clic para subir imágenes</p>
                </>
              )}
            </div>
          </label>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalPrice">Precio Total *</Label>
          <Input
            id="totalPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.totalPrice}
            onChange={(e) => handleInputChange('totalPrice', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="advance">Anticipo</Label>
          <Input
            id="advance"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.advance}
            onChange={(e) => handleInputChange('advance', e.target.value)}
          />
        </div>
      </div>

      {/* Solo mostrar estados cuando se está editando un pedido */}
      {order && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_produccion">En Producción</SelectItem>
                <SelectItem value="listo">Listo</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentStatus">Estado de Pago</Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={(value) => handleInputChange('paymentStatus', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="anticipo_recibido">Anticipo Recibido</SelectItem>
                <SelectItem value="pagado">Pagado Totalmente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}



      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || uploadingImage} className="flex-1">
          {loading ? 'Guardando...' : order ? 'Actualizar' : 'Crear Pedido'}
        </Button>
      </div>
    </form>
  );
}
