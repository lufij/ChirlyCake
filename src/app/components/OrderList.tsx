import { useState, useEffect } from 'react';
import { User, Order, Customer, getOrders, getCustomers, deleteOrder, updateOrder } from '../lib/api';
import { OrderForm } from './OrderForm';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Edit, Trash2, Eye, Clock, CheckCircle, Package, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Printer, MessageCircle, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ZoomableImage } from './ImageViewer';

interface OrderListProps {
  user: User;
}

const statusLabels: Record<Order['status'], string> = {
  pendiente: 'Pendiente',
  pendiente_confirmacion: 'Pendiente Confirmación',
  en_produccion: 'En Producción',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const statusColors: Record<Order['status'], string> = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  pendiente_confirmacion: 'bg-purple-100 text-purple-800 border-purple-300',
  en_produccion: 'bg-blue-100 text-blue-800 border-blue-300',
  listo: 'bg-green-100 text-green-800 border-green-300',
  entregado: 'bg-gray-100 text-gray-800 border-gray-300',
  cancelado: 'bg-red-100 text-red-800 border-red-300',
};

const statusBgColors: Record<Order['status'], string> = {
  pendiente: 'bg-gradient-to-br from-yellow-50 to-orange-50',
  pendiente_confirmacion: 'bg-gradient-to-br from-purple-50 to-pink-50',
  en_produccion: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  listo: 'bg-gradient-to-br from-green-50 to-emerald-50',
  entregado: 'bg-gradient-to-br from-gray-50 to-slate-50',
  cancelado: 'bg-gradient-to-br from-red-50 to-pink-50',
};

const paymentLabels: Record<Order['paymentStatus'], string> = {
  pendiente: 'Pendiente',
  anticipo_recibido: 'Anticipo',
  pagado: 'Pagado',
};

const AVAILABLE_TAGS = [
  { id: 'urgente', label: '🔴 Urgente', color: 'bg-red-100 text-red-700' },
  { id: 'cumpleanos', label: '🎂 Cumpleaños', color: 'bg-pink-100 text-pink-700' },
  { id: 'empresa', label: '🏢 Empresa', color: 'bg-blue-100 text-blue-700' },
  { id: 'corporativo', label: '💼 Corporativo', color: 'bg-purple-100 text-purple-700' },
  { id: 'boda', label: '💍 Boda', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'especial', label: '⭐ Especial', color: 'bg-orange-100 text-orange-700' },
];

function getOrderTags(orderId: string): string[] {
  try { return JSON.parse(localStorage.getItem(`order_tags_${orderId}`) || '[]'); } catch { return []; }
}
function setOrderTags(orderId: string, tags: string[]) {
  localStorage.setItem(`order_tags_${orderId}`, JSON.stringify(tags));
}

function printOrder(order: Order, customerName: string) {
  const win = window.open('', '_blank');
  if (!win) return;
  const date = new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' });
  win.document.write(`
    <html><head><title>Pedido</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; color: #111; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .sub { color: #666; font-size: 13px; margin-bottom: 20px; }
      .row { display: flex; gap: 24px; margin-bottom: 12px; }
      .field { flex: 1; }
      .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: .5px; }
      .value { font-size: 15px; font-weight: 600; margin-top: 2px; }
      .desc { background: #f5f5f5; padding: 12px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; margin-bottom: 16px; }
      .prices { display: flex; gap: 16px; background: #fafafa; border: 1px solid #eee; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
      .price-item { flex: 1; text-align: center; }
      .price-num { font-size: 20px; font-weight: 700; }
      .footer { border-top: 1px solid #eee; padding-top: 12px; font-size: 11px; color: #aaa; }
      @media print { body { padding: 0; } }
    </style></head><body>
    <h1>Orden de Pedido</h1>
    <div class="sub">Pastelería · ${new Date().toLocaleDateString('es-GT')}</div>
    <div class="row">
      <div class="field"><div class="label">Cliente</div><div class="value">${customerName}</div></div>
      <div class="field"><div class="label">Estado</div><div class="value">${order.status.replace(/_/g,' ')}</div></div>
    </div>
    <div class="row">
      <div class="field"><div class="label">Fecha de entrega</div><div class="value">${date}</div></div>
      <div class="field"><div class="label">Hora</div><div class="value">${order.deliveryTime}</div></div>
    </div>
    <div class="label" style="margin-bottom:6px">Descripción del pedido</div>
    <div class="desc">${order.description}</div>
    <div class="prices">
      <div class="price-item"><div class="label">Total</div><div class="price-num">Q${order.totalPrice.toFixed(2)}</div></div>
      <div class="price-item"><div class="label">Anticipo</div><div class="price-num" style="color:#16a34a">Q${order.advance.toFixed(2)}</div></div>
      <div class="price-item"><div class="label">Pendiente</div><div class="price-num" style="color:#ea580c">Q${order.pending.toFixed(2)}</div></div>
    </div>
    <div class="footer">Impreso el ${new Date().toLocaleString('es-GT')}</div>
    <script>window.onload=()=>{ window.print(); }<\/script>
    </body></html>
  `);
  win.document.close();
}

function sendWhatsAppConfirmation(order: Order, customer: Customer | undefined) {
  if (!customer?.phone) { return; }
  const date = new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' });
  const msg = `Hola ${customer.name} 😊\n\n` +
    `Te confirmamos tu pedido:\n\n` +
    `📋 *${order.description}*\n\n` +
    `📅 Fecha de entrega: *${date}*\n` +
    `🕐 Hora: *${order.deliveryTime}*\n\n` +
    `💰 Total: *Q${order.totalPrice.toFixed(2)}*\n` +
    (order.advance > 0 ? `✅ Anticipo recibido: Q${order.advance.toFixed(2)}\n` : '') +
    (order.pending > 0 ? `⏳ Pendiente de pago: Q${order.pending.toFixed(2)}\n` : '') +
    `\n¡Gracias por tu confianza! 🎂`;
  const phone = customer.phone.replace(/\D/g, '');
  const fullPhone = phone.startsWith('502') ? phone : `502${phone}`;
  window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
}

export function OrderList({ user }: OrderListProps) {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('pendientes');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, customersData] = await Promise.all([
        getOrders(),
        getCustomers(),
      ]);
      
      setAllOrders(ordersData.orders);
      setCustomers(customersData.customers);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filtrar pedidos del mes actual
    const ordersInMonth = allOrders.filter(order => {
      const orderDate = new Date(order.deliveryDate + 'T00:00:00');
      return orderDate >= monthStart && orderDate <= monthEnd;
    });

    // Filtrar por pestaña
    let filtered: Order[] = [];
    switch (activeTab) {
      case 'pendientes':
        filtered = ordersInMonth.filter(o => o.status === 'pendiente' || o.status === 'pendiente_confirmacion');
        break;
      case 'proceso':
        filtered = ordersInMonth.filter(o => o.status === 'en_produccion' || o.status === 'listo');
        break;
      case 'entregados':
        filtered = ordersInMonth.filter(o => o.status === 'entregado');
        break;
    }

    // Filtrar por etiqueta
    if (filterTag) {
      filtered = filtered.filter(o => getOrderTags(o.id).includes(filterTag));
    }

    // Ordenar por fecha de entrega
    return filtered.sort((a, b) => {
      return new Date(a.deliveryDate + 'T00:00:00').getTime() - new Date(b.deliveryDate + 'T00:00:00').getTime();
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;

    try {
      await deleteOrder(deleteOrderId);
      toast.success('Pedido eliminado');
      setDeleteOrderId(null);
      loadData();
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast.error(error.message || 'Error al eliminar el pedido');
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    loadData();
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const order = allOrders.find(o => o.id === orderId);
      if (!order) return;

      // Si se marca como entregado, automáticamente marcar como pagado totalmente
      const updatedOrder = { ...order, status: newStatus };
      if (newStatus === 'entregado') {
        updatedOrder.paymentStatus = 'pagado';
        updatedOrder.advance = order.totalPrice; // El anticipo debe ser igual al total
      }

      await updateOrder(orderId, updatedOrder);
      toast.success(newStatus === 'entregado' ? 'Pedido entregado y marcado como pagado' : 'Estado actualizado');
      loadData();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Error al actualizar el estado');
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Cliente desconocido';
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Navigator */}
      <Card className="border-2 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth} className="flex-shrink-0 hover:bg-white px-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1 text-center">
              <div className="text-lg sm:text-2xl font-medium text-gray-900 capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </div>
              <button onClick={handleCurrentMonth} className="text-xs text-pink-600 hover:text-pink-700 mt-0.5 flex items-center gap-1 mx-auto">
                <CalendarIcon className="w-3 h-3" /> Mes actual
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={handleNextMonth} className="flex-shrink-0 hover:bg-white px-2">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreateOrder} className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Pedido
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tag filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterTag(null)}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${!filterTag ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
        >
          <Tag className="w-3 h-3" /> Todas
        </button>
        {AVAILABLE_TAGS.map(tag => (
          <button
            key={tag.id}
            onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterTag === tag.id ? tag.color + ' border-current' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="pendientes" className="text-sm py-2 sm:py-3">
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Pendientes</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                {allOrders.filter(o => {
                  const orderDate = new Date(o.deliveryDate + 'T00:00:00');
                  return orderDate >= startOfMonth(currentMonth) && 
                         orderDate <= endOfMonth(currentMonth) && 
                         (o.status === 'pendiente' || o.status === 'pendiente_confirmacion');
                }).length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="proceso" className="text-sm py-2 sm:py-3">
            <div className="flex flex-col items-center gap-1">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">En Proceso</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {allOrders.filter(o => {
                  const orderDate = new Date(o.deliveryDate + 'T00:00:00');
                  return orderDate >= startOfMonth(currentMonth) && 
                         orderDate <= endOfMonth(currentMonth) && 
                         (o.status === 'en_produccion' || o.status === 'listo');
                }).length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="entregados" className="text-sm py-2 sm:py-3">
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Entregados</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {allOrders.filter(o => {
                  const orderDate = new Date(o.deliveryDate + 'T00:00:00');
                  return orderDate >= startOfMonth(currentMonth) && 
                         orderDate <= endOfMonth(currentMonth) && 
                         o.status === 'entregado';
                }).length}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-4">
          <OrdersGrid 
            orders={filteredOrders}
            customers={customers}
            user={user}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={setDeleteOrderId}
            onStatusChange={handleStatusChange}
            getCustomerName={getCustomerName}
          />
        </TabsContent>

        <TabsContent value="proceso" className="mt-4">
          <OrdersGrid 
            orders={filteredOrders}
            customers={customers}
            user={user}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={setDeleteOrderId}
            onStatusChange={handleStatusChange}
            getCustomerName={getCustomerName}
          />
        </TabsContent>

        <TabsContent value="entregados" className="mt-4">
          <OrdersGrid 
            orders={filteredOrders}
            customers={customers}
            user={user}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={setDeleteOrderId}
            onStatusChange={handleStatusChange}
            getCustomerName={getCustomerName}
          />
        </TabsContent>
      </Tabs>

      {/* Order Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder ? 'Editar Pedido' : 'Nuevo Pedido'}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder ? 'Modifica los detalles del pedido.' : 'Completa el formulario para crear un nuevo pedido.'}
            </DialogDescription>
          </DialogHeader>
          <OrderForm
            order={selectedOrder}
            customers={customers}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido</DialogTitle>
            <DialogDescription>
              Información completa del pedido seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-600">Cliente</h4>
                <p>{getCustomerName(selectedOrder.customerId)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-600">Fecha de Entrega</h4>
                  <p>{format(new Date(selectedOrder.deliveryDate + 'T00:00:00'), "d 'de' MMMM, yyyy", { locale: es })}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Hora</h4>
                  <p>{selectedOrder.deliveryTime}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-600">Descripción</h4>
                <p className="whitespace-pre-wrap">{selectedOrder.description}</p>
              </div>

              {selectedOrder.images && selectedOrder.images.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Imágenes de Referencia (Toca para ampliar)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrder.images.map((url, idx) => (
                      <ZoomableImage
                        key={idx} 
                        src={url} 
                        alt={`Referencia ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <h4 className="text-xs text-gray-500">Total</h4>
                  <p className="text-base font-bold">Q{selectedOrder.totalPrice.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <h4 className="text-xs text-gray-500">Anticipo</h4>
                  <p className="text-base font-bold text-green-700">Q{selectedOrder.advance.toFixed(2)}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <h4 className="text-xs text-gray-500">Pendiente</h4>
                  <p className="text-base font-bold text-orange-600">Q{selectedOrder.pending.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <h4 className="text-sm text-gray-600">Estado</h4>
                  <Badge className={statusColors[selectedOrder.status]}>
                    {statusLabels[selectedOrder.status]}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Estado de Pago</h4>
                  <Badge variant="outline">{paymentLabels[selectedOrder.paymentStatus]}</Badge>
                </div>
              </div>

              {/* Tags */}
              <OrderTagsEditor orderId={selectedOrder.id} />

              {/* Acciones */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => {
                    const customer = customers.find(c => c.id === selectedOrder.customerId);
                    sendWhatsAppConfirmation(selectedOrder, customer);
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => printOrder(selectedOrder, getCustomerName(selectedOrder.customerId))}
                >
                  <Printer className="w-4 h-4 text-gray-600" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El pedido será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Editor de etiquetas por pedido
function OrderTagsEditor({ orderId }: { orderId: string }) {
  const [tags, setTags] = useState<string[]>(() => getOrderTags(orderId));

  const toggle = (tagId: string) => {
    const next = tags.includes(tagId) ? tags.filter(t => t !== tagId) : [...tags, tagId];
    setTags(next);
    setOrderTags(orderId, next);
  };

  return (
    <div>
      <h4 className="text-sm text-gray-600 mb-2 flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Etiquetas</h4>
      <div className="flex flex-wrap gap-1.5">
        {AVAILABLE_TAGS.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggle(tag.id)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${tags.includes(tag.id) ? tag.color + ' border-current font-medium' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400'}`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Componente auxiliar para mostrar la grid de pedidos
interface OrdersGridProps {
  orders: Order[];
  customers: Customer[];
  user: User;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  getCustomerName: (customerId: string) => string;
}

function OrdersGrid({ 
  orders, 
  customers, 
  user, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  getCustomerName 
}: OrdersGridProps) {
  if (orders.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay pedidos en esta categoría</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map(order => (
        <Card key={order.id} className={`hover:shadow-lg transition-all border-2 overflow-hidden ${statusBgColors[order.status]}`}>
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Imagen */}
              {order.images && order.images.length > 0 && (
                <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                  <ZoomableImage
                    src={order.images[0]} 
                    alt="Pedido" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Contenido */}
              <div className="flex-1 p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg">{getCustomerName(order.customerId)}</h3>
                      {order.status === 'pendiente_confirmacion' && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs animate-pulse">
                          🎂 Pedido Público
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      📅 {format(new Date(order.deliveryDate + 'T00:00:00'), "d 'de' MMMM, yyyy", { locale: es })} • 🕐 {order.deliveryTime}
                    </p>
                  </div>
                  <Badge className={`${statusColors[order.status]} border`}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
                
                {/* Etiquetas */}
                {(() => {
                  const tags = getOrderTags(order.id);
                  if (tags.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-1">
                      {tags.map(tid => {
                        const t = AVAILABLE_TAGS.find(t => t.id === tid);
                        return t ? <span key={tid} className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{t.label}</span> : null;
                      })}
                    </div>
                  );
                })()}

                {/* Descripción */}
                <p className="text-sm text-gray-700 line-clamp-2">{order.description}</p>
                
                {/* Precios */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/60 px-3 py-1.5 rounded-lg border">
                    <span className="text-xs text-gray-600">Total:</span>
                    <span className="ml-1 font-semibold">Q{order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/60 px-3 py-1.5 rounded-lg border">
                    <span className="text-xs text-gray-600">Anticipo:</span>
                    <span className="ml-1 font-semibold text-green-700">Q{order.advance.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/60 px-3 py-1.5 rounded-lg border">
                    <span className="text-xs text-gray-600">Pendiente:</span>
                    <span className="ml-1 font-semibold text-orange-700">Q{order.pending.toFixed(2)}</span>
                  </div>
                  <Badge variant="outline" className="self-center">{paymentLabels[order.paymentStatus]}</Badge>
                </div>

                {/* Botones de Acción Rápida */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {order.status === 'pendiente' && (
                    <Button 
                      size="sm" 
                      onClick={() => onStatusChange(order.id, 'en_produccion')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      En Producción
                    </Button>
                  )}
                  {order.status === 'en_produccion' && (
                    <Button 
                      size="sm" 
                      onClick={() => onStatusChange(order.id, 'listo')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Package className="w-4 h-4 mr-1" />
                      Marcar Listo
                    </Button>
                  )}
                  {order.status === 'listo' && (
                    <Button 
                      size="sm" 
                      onClick={() => onStatusChange(order.id, 'entregado')}
                      className="bg-gray-700 hover:bg-gray-800"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Entregado
                    </Button>
                  )}
                </div>
              </div>

              {/* Acciones Laterales */}
              <div className="flex md:flex-col gap-2 p-4 md:pl-0 border-t md:border-t-0 md:border-l bg-white/40">
                <Button size="sm" variant="outline" onClick={() => onView(order)} className="flex-1 md:flex-none">
                  <Eye className="w-4 h-4 md:mr-0" />
                  <span className="md:hidden ml-2">Ver</span>
                </Button>
                {user.role === 'propietario' && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(order)} className="flex-1 md:flex-none">
                    <Edit className="w-4 h-4 md:mr-0" />
                    <span className="md:hidden ml-2">Editar</span>
                  </Button>
                )}
                {['administrador', 'propietario'].includes(user.role) && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 md:flex-none" 
                    onClick={() => onDelete(order.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 md:mr-0" />
                    <span className="md:hidden ml-2">Eliminar</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
