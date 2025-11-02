import { useState, useEffect } from 'react';
import { User } from '../lib/api';
import { OrderList } from './OrderList';
import { CustomerList } from './CustomerList';
import { CalendarView } from './CalendarView';
import { Finances } from './Finances';
import { Reports } from './Reports';
import { UserManagement } from './UserManagement';
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
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { InstallHelp } from './InstallHelp';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthToken(null);
    onLogout();
    toast.success('Sesión cerrada correctamente');
  };

  // Tabs available for each role
  const tabs = [
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag, roles: ['vendedor', 'administrador', 'propietario'] },
    { id: 'calendario', label: 'Calendario', icon: Calendar, roles: ['vendedor', 'administrador', 'propietario'] },
    { id: 'clientes', label: 'Clientes', icon: Users, roles: ['propietario'] },
    { id: 'finanzas', label: 'Finanzas', icon: DollarSign, roles: ['propietario'] },
    { id: 'reportes', label: 'Reportes', icon: BarChart3, roles: ['administrador', 'propietario'] },
    { id: 'usuarios', label: 'Usuarios', icon: UserCog, roles: ['administrador', 'propietario'] },
  ];

  const availableTabs = tabs.filter(tab => tab.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-lg">
              <Cake className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="font-semibold">Pastelería</h1>
              <p className="text-sm text-gray-600">{user.name} - {user.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PublicOrderLink />
            {!window.matchMedia('(display-mode: standalone)').matches && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowInstallHelp(true)}
                className="hidden sm:flex"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Instalar App
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
            {availableTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="pedidos">
            <OrderList user={user} />
          </TabsContent>

          <TabsContent value="calendario">
            <CalendarView user={user} />
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
