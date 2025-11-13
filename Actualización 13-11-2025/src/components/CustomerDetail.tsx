import { useState, useEffect } from 'react';
import { getCustomer, Order } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CustomerDetailProps {
  customerId: string;
}

const statusLabels: Record<Order['status'], string> = {
  pendiente: 'Pendiente',
  en_produccion: 'En Producción',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const statusColors: Record<Order['status'], string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_produccion: 'bg-blue-100 text-blue-800',
  listo: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800',
};

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerDetail();
  }, [customerId]);

  const loadCustomerDetail = async () => {
    setLoading(true);
    try {
      const data = await getCustomer(customerId);
      setCustomer(data.customer);
      setOrders(data.orders || []);
    } catch (error: any) {
      console.error('Error loading customer detail:', error);
      toast.error('Error al cargar la información del cliente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!customer) {
    return <div className="text-center py-8 text-gray-500">Cliente no encontrado</div>;
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="space-y-4">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.address && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span>{customer.address}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total de Pedidos</div>
            <div className="text-2xl">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Gastado</div>
            <div className="text-2xl">Q{totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No hay pedidos registrados</p>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.deliveryDate + 'T00:00:00'), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                      <p className="text-sm line-clamp-1">{order.description}</p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span>Q{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
