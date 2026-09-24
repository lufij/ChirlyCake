import { useState, useEffect, useRef } from 'react';
import { User, getOrders, getCustomers, getAuthToken, Customer } from '../lib/api';
import { OrderList } from './OrderList';
import { CustomerList } from './CustomerList';
import { CalendarView } from './CalendarView';
import { Finances } from './Finances';
import { Reports } from './Reports';
import { UserManagement } from './UserManagement';
import { Inventory } from './Inventory';
import { PublicOrderLink } from './PublicOrderLink';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { supabase } from '../lib/supabase';
import { setAuthToken } from '../lib/api';
import {
  Calendar,
  ShoppingBag,
  Users,
  DollarSign,
  BarChart3,
  LogOut,
  UserCog,
  Cake,
  Smartphone,
  Package,
  Gift,
} from 'lucide-react';
import { toast } from 'sonner';
import { InstallHelp } from './InstallHelp';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { format, isSameDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  // Badges
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [birthdayAlert, setBirthdayAlert] = useState<Customer[]>([]);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // Read low stock from localStorage
  useEffect(() => {
    function readLowStock() {
      try {
        const raw = localStorage.getItem('pasteleria_inventory_products');
        if (raw) {
          const products = JSON.parse(raw);
          setLowStockCount(products.filter((p: any) => p.stock <= p.minStock).length);
        }
      } catch {}
    }
    readLowStock();
    const interval = setInterval(readLowStock, 10000);
    return () => clearInterval(interval);
  }, []);

  // Poll for new orders every 30s — wait 2s on first run to ensure token is ready
  useEffect(() => {
    let cancelled = false;
    async function checkOrders() {
      if (!getAuthToken()) return; // skip if not authenticated
      try {
        const { orders } = await getOrders();
        if (cancelled) return;
        if (isFirstLoad.current) {
          orders.forEach(o => knownOrderIds.current.add(o.id));
          isFirstLoad.current = false;
          return;
        }
        let newCount = 0;
        orders.forEach(o => {
          if (!knownOrderIds.current.has(o.id)) {
            knownOrderIds.current.add(o.id);
            newCount++;
          }
        });
        if (newCount > 0) {
          setNewOrdersCount(prev => prev + newCount);
          toast.info(`🔔 ${newCount} pedido${newCount > 1 ? 's' : ''} nuevo${newCount > 1 ? 's' : ''}`, { duration: 5000 });
        }
      } catch { /* silent — polling errors shouldn't affect the session */ }
    }
    const timer = setTimeout(() => {
      checkOrders();
    }, 2000); // wait 2s for auth to settle
    const interval = setInterval(checkOrders, 30000);
    return () => { cancelled = true; clearTimeout(timer); clearInterval(interval); };
  }, []);

  // Clear new orders badge when switching to pedidos tab
  useEffect(() => {
    if (activeTab === 'pedidos') setNewOrdersCount(0);
    if (activeTab === 'inventario') setLowStockCount(0);
  }, [activeTab]);

  // Check birthdays from localStorage — also wait for auth
  useEffect(() => {
    async function checkBirthdays() {
      if (!getAuthToken()) return;
      try {
        const { customers } = await getCustomers();
        const today = new Date();
        const nextWeek = addDays(today, 7);
        const birthdays: Customer[] = [];

        customers.forEach(c => {
          const bday = localStorage.getItem(`birthday_${c.id}`);
          if (bday) {
            const bdayDate = new Date(bday);
            const thisYear = new Date(today.getFullYear(), bdayDate.getMonth(), bdayDate.getDate());
            if (thisYear >= today && thisYear <= nextWeek) {
              birthdays.push(c);
            }
          }
        });
        setBirthdayAlert(birthdays);
      } catch {}
    }
    setTimeout(checkBirthdays, 3000); // wait for auth to settle
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthToken(null);
    onLogout();
    toast.success('Sesión cerrada correctamente');
  };

  const tabs = [
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag, roles: ['vendedor', 'administrador', 'propietario'], badge: newOrdersCount },
    { id: 'calendario', label: 'Calendario', icon: Calendar, roles: ['vendedor', 'administrador', 'propietario'], badge: 0 },
    { id: 'inventario', label: 'Inventario', icon: Package, roles: ['administrador', 'propietario'], badge: lowStockCount },
    { id: 'clientes', label: 'Clientes', icon: Users, roles: ['administrador', 'propietario'], badge: 0 },
    { id: 'usuarios', label: 'Usuarios', icon: UserCog, roles: ['administrador', 'propietario'], badge: 0 },
  ];

  const availableTabs = tabs.filter(tab => tab.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-pink-100 p-2 rounded-lg flex-shrink-0">
              <Cake className="w-5 h-5 text-pink-600" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-sm sm:text-base truncate">Pastelería</h1>
              <p className="text-xs text-gray-500 truncate">{user.name} · {user.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {birthdayAlert.length > 0 && (
              <button
                onClick={() => toast.info(`🎂 Cumpleaños esta semana: ${birthdayAlert.map(c => c.name).join(', ')}`, { duration: 8000 })}
                className="flex items-center gap-1 bg-pink-100 text-pink-700 text-xs font-medium px-2 py-1.5 rounded-full hover:bg-pink-200 transition-colors"
              >
                <Gift className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{birthdayAlert.length} cumpleaños</span>
              </button>
            )}
            <PublicOrderLink />
            {!window.matchMedia('(display-mode: standalone)').matches && (
              <Button variant="outline" size="sm" onClick={() => setShowInstallHelp(true)} className="hidden md:flex">
                <Smartphone className="w-4 h-4 mr-2" />
                Instalar
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto mb-6">
            <TabsList className="flex w-max min-w-full">
              {availableTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 flex-1 whitespace-nowrap relative">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <Badge count={tab.badge} />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="pedidos">
            <OrderList user={user} />
          </TabsContent>

          <TabsContent value="calendario">
            <CalendarView user={user} />
          </TabsContent>

          <TabsContent value="inventario">
            <Inventory user={user} />
          </TabsContent>

          <TabsContent value="clientes">
            <CustomerList user={user} />
          </TabsContent>

          <TabsContent value="finanzas">
            <Finances user={user} />
          </TabsContent>

          <TabsContent value="reportes">
            <Reports user={user} />
          </TabsContent>

          <TabsContent value="usuarios">
            <UserManagement user={user} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Install Help Dialog */}
      <Dialog open={showInstallHelp} onOpenChange={setShowInstallHelp}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Guía de Instalación de la PWA</DialogTitle>
          <DialogDescription className="sr-only">
            Instrucciones completas para instalar Pastelería Pro como aplicación en tu dispositivo
          </DialogDescription>
          <InstallHelp />
        </DialogContent>
      </Dialog>
    </div>
  );
}
