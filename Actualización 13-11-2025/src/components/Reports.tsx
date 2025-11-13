import { useState, useEffect } from 'react';
import { User, getReport } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Calendar, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner@2.0.3';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths, subMonths, addWeeks, subWeeks, addDays, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportsProps {
  user: User;
}

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  en_produccion: 'En Producción',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

type ViewMode = 'day' | 'week' | 'month';

export function Reports({ user }: ReportsProps) {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    loadReport();
  }, [viewMode, currentDate]);

  const getDateRange = () => {
    let start, end;
    
    switch (viewMode) {
      case 'day':
        start = startOfDay(currentDate);
        end = endOfDay(currentDate);
        break;
      case 'week':
        start = startOfWeek(currentDate, { locale: es });
        end = endOfWeek(currentDate, { locale: es });
        break;
      case 'month':
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
    }

    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    };
  };

  const getPeriodLabel = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, "d 'de' MMMM, yyyy", { locale: es });
      case 'week':
        const weekStart = startOfWeek(currentDate, { locale: es });
        const weekEnd = endOfWeek(currentDate, { locale: es });
        return `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;
      case 'month':
        return format(currentDate, "MMMM yyyy", { locale: es });
    }
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      const data = await getReport(startDate, endDate);
      setReportData(data);
    } catch (error: any) {
      console.error('Error loading report:', error);
      toast.error('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomReport = async () => {
    if (!customStartDate || !customEndDate) {
      toast.error('Por favor selecciona ambas fechas');
      return;
    }
    
    setLoading(true);
    try {
      const data = await getReport(customStartDate, customEndDate);
      setReportData(data);
      toast.success('Reporte personalizado generado');
    } catch (error: any) {
      console.error('Error loading report:', error);
      toast.error('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const generatePDF = () => {
    toast.info('Función de exportación en desarrollo');
  };

  const orderStatusData = reportData?.orders?.byStatus
    ? Object.entries(reportData.orders.byStatus).map(([status, count]) => ({
        name: statusLabels[status] || status,
        value: count as number,
      }))
    : [];

  const expenseCategoryData = reportData?.finances?.expensesByCategory
    ? Object.entries(reportData.finances.expensesByCategory).map(([category, amount]) => ({
        name: category,
        value: amount as number,
      }))
    : [];

  return (
    <div className="space-y-4">
      {/* Period Navigator */}
      <Card className="border-2 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50">
        <CardContent className="p-6">
          {/* View Mode Selector */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              onClick={() => setViewMode('day')}
              className={viewMode === 'day' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            >
              📅 Día
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            >
              📊 Semana
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              onClick={() => setViewMode('month')}
              className={viewMode === 'month' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            >
              📆 Mes
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              className="flex-shrink-0 hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Anterior
            </Button>

            <div className="flex-1 text-center">
              <div className="text-2xl font-medium text-gray-900 mb-1 capitalize">
                {getPeriodLabel()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToday}
                className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
              >
                Ir a Hoy
              </Button>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              className="flex-shrink-0 hover:bg-white"
            >
              Siguiente
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          {/* Custom Range Collapsible */}
          <Collapsible open={showCustomRange} onOpenChange={setShowCustomRange} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4 mr-2" />
                {showCustomRange ? 'Ocultar' : 'Mostrar'} Rango Personalizado
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="customStartDate">Fecha Inicio</Label>
                    <Input
                      id="customStartDate"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customEndDate">Fecha Fin</Label>
                    <Input
                      id="customEndDate"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={loadCustomReport} className="w-full" disabled={loading}>
                  {loading ? 'Cargando...' : 'Generar Reporte Personalizado'}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando reporte...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {reportData && !loading && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Total Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-medium">{reportData.orders.total}</div>
                <p className="text-xs text-gray-500 mt-1">En el período seleccionado</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Ventas Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-medium text-green-600">
                  Q{reportData.orders.totalSales.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Ingresos por pedidos</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Gastos Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-medium text-red-600">
                  Q{reportData.finances.totalExpenses.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Egresos del período</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Ganancia Neta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-medium ${reportData.finances.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Q{reportData.finances.netProfit.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {reportData.finances.netProfit >= 0 ? '¡Ganancia positiva!' : 'Resultado negativo'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Detalles de Pedidos</span>
                  <Button variant="outline" size="sm" onClick={generatePDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <span className="text-sm text-gray-700 font-medium">Ventas Totales</span>
                    <span className="text-xl font-medium text-green-700">Q{reportData.orders.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <span className="text-sm text-gray-700 font-medium">Anticipos Recibidos</span>
                    <span className="text-xl font-medium text-blue-700">Q{reportData.orders.totalAdvances.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <span className="text-sm text-gray-700 font-medium">Saldo Pendiente</span>
                    <span className="text-xl font-medium text-orange-700">Q{reportData.orders.totalPending.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Estado de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No hay datos para mostrar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Ingresos Totales</span>
                    </div>
                    <span className="text-xl font-medium text-green-600">Q{reportData.finances.totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="px-3 space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 ml-7">• Ventas de Pedidos</span>
                      <span className="font-medium">Q{reportData.finances.totalSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 ml-7">• Otros Ingresos</span>
                      <span className="font-medium">Q{reportData.finances.otherIncome.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Egresos Totales</span>
                    </div>
                    <span className="text-xl font-medium text-red-600">Q{reportData.finances.totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300 mt-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-lg">Ganancia Neta</span>
                    </div>
                    <span className={`text-2xl font-medium ${reportData.finances.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Q{reportData.finances.netProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Egresos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                {expenseCategoryData.length > 0 ? (
                  <div className="space-y-4">
                    {expenseCategoryData.map((item, idx) => {
                      const total = reportData.finances.totalExpenses;
                      const percentage = total > 0 ? (item.value / total) * 100 : 0;
                      
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700 font-medium">{item.name}</span>
                            <span className="font-medium text-gray-900">Q{item.value.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-pink-600 to-purple-600 h-3 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 text-right font-medium">
                            {percentage.toFixed(1)}% del total
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No hay gastos en este período</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
