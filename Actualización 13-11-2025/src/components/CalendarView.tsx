import { useState, useEffect } from 'react';
import { User, Order, Customer, getOrders, getCustomers } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarViewProps {
  user: User;
}

// Colores vibrantes y modernos para cada estado
const statusConfig: Record<Order['status'], { bg: string; border: string; text: string; dot: string; label: string }> = {
  pendiente: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-900',
    dot: 'bg-amber-500',
    label: 'Pendiente'
  },
  en_produccion: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-900',
    dot: 'bg-blue-500',
    label: 'En Producción'
  },
  listo: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-400',
    text: 'text-emerald-900',
    dot: 'bg-emerald-500',
    label: 'Listo'
  },
  entregado: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-900',
    dot: 'bg-purple-500',
    label: 'Entregado'
  },
  cancelado: {
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    text: 'text-rose-900',
    dot: 'bg-rose-500',
    label: 'Cancelado'
  },
};

export function CalendarView({ user }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

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
      setOrders(ordersData.orders);
      setCustomers(customersData.customers);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Cliente desconocido';
  };

  const getOrdersForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let filtered = orders.filter(order => order.deliveryDate === dateStr);
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    return filtered.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));
  };

  const getStatusSummary = (date: Date) => {
    const dayOrders = getOrdersForDate(date);
    const summary: Record<string, number> = {};
    dayOrders.forEach(order => {
      summary[order.status] = (summary[order.status] || 0) + 1;
    });
    return summary;
  };

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { locale: es });
    const calendarEnd = endOfWeek(monthEnd, { locale: es });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
      <div className="space-y-2">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => (
            <div 
              key={day} 
              className={`text-center text-sm py-2 rounded-lg ${
                idx === 0 || idx === 6 ? 'bg-pink-50 text-pink-700' : 'bg-gray-50 text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dayOrders = getOrdersForDate(day);
            const statusSummary = getStatusSummary(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isPast = day < new Date() && !isToday;

            return (
              <div
                key={day.toISOString()}
                className={`min-h-28 p-2 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                  !isCurrentMonth 
                    ? 'bg-gray-50/50 text-gray-400 border-gray-100' 
                    : 'bg-white border-gray-200 hover:border-pink-300 hover:shadow-lg'
                } ${isToday ? 'border-pink-500 shadow-lg ring-2 ring-pink-200' : ''} ${
                  isPast && isCurrentMonth ? 'opacity-60' : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday 
                      ? 'bg-pink-500 text-white px-2 py-1 rounded-full text-xs' 
                      : isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayOrders.length > 0 && (
                    <span className="bg-pink-100 text-pink-700 text-xs px-1.5 py-0.5 rounded-full">
                      {dayOrders.length}
                    </span>
                  )}
                </div>

                {/* Status dots */}
                <div className="space-y-1">
                  {Object.entries(statusSummary).slice(0, 3).map(([status, count]) => {
                    const config = statusConfig[status as Order['status']];
                    if (!config) return null;
                    return (
                      <div 
                        key={status} 
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${config.bg} ${config.border} border`}
                      >
                        <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                        <span className={`text-xs ${config.text}`}>{count}</span>
                      </div>
                    );
                  })}
                  {Object.keys(statusSummary).length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{Object.keys(statusSummary).length - 3}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { locale: es });
    const weekEnd = endOfWeek(currentDate, { locale: es });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-3">
        {days.map(day => {
          const dayOrders = getOrdersForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day.toISOString()} className="space-y-2">
              <div
                className={`text-center p-3 rounded-xl transition-all ${
                  isToday 
                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-700'
                }`}
              >
                <div className="text-xs uppercase">{format(day, 'EEE', { locale: es })}</div>
                <div className="text-2xl">{format(day, 'd')}</div>
                <div className="text-xs">{format(day, 'MMM', { locale: es })}</div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dayOrders.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-4">Sin pedidos</div>
                ) : (
                  dayOrders.map(order => {
                    const config = statusConfig[order.status];
                    if (!config) return null;
                    return (
                      <Card
                        key={order.id}
                        className={`cursor-pointer hover:scale-105 transition-transform ${config.bg} ${config.border} border-l-4`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <CardContent className="p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs font-medium">{order.deliveryTime}</span>
                          </div>
                          <div className={`text-sm truncate ${config.text}`}>
                            {getCustomerName(order.customerId)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                            <span className="text-xs text-gray-600">{config.label}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayOrders = getOrdersForDate(currentDate);
    const isToday = isSameDay(currentDate, new Date());
    const statusSummary = getStatusSummary(currentDate);

    return (
      <div className="space-y-4">
        {/* Day header with stats */}
        <div className={`p-6 rounded-2xl ${
          isToday 
            ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white' 
            : 'bg-gradient-to-br from-gray-100 to-gray-50'
        }`}>
          <div className="text-center">
            <div className={`text-3xl ${isToday ? 'text-white' : 'text-gray-900'}`}>
              {format(currentDate, "d 'de' MMMM, yyyy", { locale: es })}
            </div>
            <div className={`text-sm mt-2 ${isToday ? 'text-pink-100' : 'text-gray-600'}`}>
              {dayOrders.length} {dayOrders.length === 1 ? 'pedido' : 'pedidos'}
            </div>
          </div>

          {/* Status summary badges */}
          {Object.keys(statusSummary).length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {Object.entries(statusSummary).map(([status, count]) => {
                const config = statusConfig[status as Order['status']];
                if (!config) return null;
                return (
                  <div 
                    key={status}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      isToday ? 'bg-white/20 text-white' : `${config.bg} ${config.text}`
                    } border ${isToday ? 'border-white/30' : config.border}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${isToday ? 'bg-white' : config.dot}`}></div>
                    <span className="text-sm">{config.label}: {count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {dayOrders.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay pedidos para este día</p>
              </CardContent>
            </Card>
          ) : (
            dayOrders.map(order => {
              const config = statusConfig[order.status];
              if (!config) return null;
              return (
                <Card 
                  key={order.id} 
                  className={`hover:shadow-xl transition-all border-l-4 ${config.border} ${config.bg}`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border ${config.border}`}>
                            <Clock className={`w-4 h-4 ${config.text}`} />
                            <span className={`font-medium ${config.text}`}>{order.deliveryTime}</span>
                          </div>
                          <Badge className={`${config.bg} ${config.text} border ${config.border}`}>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                              {config.label}
                            </div>
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {getCustomerName(order.customerId)}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{order.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">Total:</span>
                            <span className="font-medium text-gray-900">Q{order.totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-600">Anticipo:</span>
                            <span className="font-medium text-gray-900">Q{order.advance.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-orange-600" />
                            <span className="text-gray-600">Pendiente:</span>
                            <span className="font-medium text-orange-600">Q{order.pending.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card className="border-2 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Navigation */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button variant="ghost" size="sm" onClick={handlePrevious} className="hover:bg-white">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleToday} className="hover:bg-white">
                  Hoy
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNext} className="hover:bg-white">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-pink-500" />
                <h2 className="text-lg font-medium">
                  {view === 'month' && format(currentDate, 'MMMM yyyy', { locale: es })}
                  {view === 'week' && `Semana del ${format(startOfWeek(currentDate, { locale: es }), 'd MMM', { locale: es })}`}
                  {view === 'day' && format(currentDate, "d 'de' MMMM", { locale: es })}
                </h2>
              </div>
            </div>

            {/* View and filter controls */}
            <div className="flex gap-2">
              <Select value={view} onValueChange={(v: any) => setView(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">📅 Mes</SelectItem>
                  <SelectItem value="week">📊 Semana</SelectItem>
                  <SelectItem value="day">📍 Día</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">⏳ Pendiente</SelectItem>
                  <SelectItem value="en_produccion">🔨 En Producción</SelectItem>
                  <SelectItem value="listo">✅ Listo</SelectItem>
                  <SelectItem value="entregado">📦 Entregado</SelectItem>
                  <SelectItem value="cancelado">❌ Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Legend */}
      <Card className="border-2 shadow-sm bg-gradient-to-r from-pink-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 mr-2">Leyenda de Estados:</span>
            {Object.entries(statusConfig).map(([status, config]) => (
              <div 
                key={status}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 ${config.bg} ${config.border} transition-transform hover:scale-105`}
              >
                <div className={`w-3 h-3 rounded-full ${config.dot}`}></div>
                <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card className="border-2 shadow-sm">
        <CardContent className="p-4">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* Date Detail Dialog */}
      {selectedDate && view === 'month' && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-pink-500" />
                {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
              </DialogTitle>
              <DialogDescription>
                {getOrdersForDate(selectedDate).length} {getOrdersForDate(selectedDate).length === 1 ? 'pedido programado' : 'pedidos programados'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {getOrdersForDate(selectedDate).length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay pedidos para este día</p>
                </div>
              ) : (
                getOrdersForDate(selectedDate).map(order => {
                  const config = statusConfig[order.status];
                  if (!config) return null;
                  return (
                    <Card 
                      key={order.id} 
                      className={`hover:shadow-md transition-shadow border-l-4 ${config.border} ${config.bg}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg} border ${config.border}`}>
                                <Clock className={`w-3 h-3 ${config.text}`} />
                                <span className={`text-sm font-medium ${config.text}`}>{order.deliveryTime}</span>
                              </div>
                              <Badge className={`${config.bg} ${config.text} border ${config.border}`}>
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                                  {config.label}
                                </div>
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900">{getCustomerName(order.customerId)}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{order.description}</p>
                            <div className="flex gap-4 text-sm mt-2">
                              <span className="text-gray-600">Total: <span className="font-medium text-gray-900">Q{order.totalPrice.toFixed(2)}</span></span>
                              <span className="text-gray-600">Pendiente: <span className="font-medium text-orange-600">Q{order.pending.toFixed(2)}</span></span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
