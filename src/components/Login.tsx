import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { setAuthToken } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Cake } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { InstallBanner } from './InstallBanner';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  // Login universal con número/PIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone) {
      toast.error('Por favor ingresa tu número/PIN');
      return;
    }

    if (phone.length < 4) {
      toast.error('Debe tener al menos 4 dígitos');
      return;
    }

    setLoading(true);

    try {
      const email = `${phone}@pasteleria.local`;
      // Si tiene 4 dígitos, agregar prefijo 'pin', sino usar el número directo
      const password = phone.length === 4 ? `pin${phone}` : phone;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Número/PIN incorrecto');
        return;
      }

      if (data.session?.access_token) {
        setAuthToken(data.session.access_token);
        toast.success('¡Bienvenido!');
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupData.firstName || !signupData.lastName || !signupData.phone) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (signupData.phone.length < 4) {
      toast.error('El número/PIN debe tener al menos 4 dígitos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95aa99a4/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            phone: signupData.phone,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Signup API error:', result);
        throw new Error(result.error || 'Error al crear la cuenta');
      }

      console.log('Signup successful:', result);

      if (result.role === 'propietario') {
        toast.success('¡Cuenta de Propietario creada!', {
          description: 'Tienes acceso completo al sistema',
        });
      } else {
        toast.success('¡Cuenta creada exitosamente!');
      }
      
      // Auto login
      const email = `${signupData.phone}@pasteleria.local`;
      const password = signupData.phone.length === 4 ? `pin${signupData.phone}` : signupData.phone;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.access_token) {
        setAuthToken(data.session.access_token);
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50">
      <InstallBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Cake className="w-8 h-8 text-pink-600" />
            </div>
          </div>
          <CardTitle>Gestión de Pastelería</CardTitle>
          <CardDescription>Inicia sesión o crea tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Número/PIN</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="1234 o 71234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Ingresa tu PIN de 4 dígitos o tu número de celular
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
                
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full gap-2 bg-purple-50 hover:bg-purple-100 border-purple-300"
                    onClick={() => window.location.hash = '#/pedido'}
                  >
                    <Cake className="w-4 h-4" />
                    🧪 Probar Formulario Público
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstName">Nombre</Label>
                  <Input
                    id="signup-firstName"
                    type="text"
                    placeholder="Juan"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastName">Apellido</Label>
                  <Input
                    id="signup-lastName"
                    type="text"
                    placeholder="Pérez"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Número/PIN</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="1234 o 71234567"
                    value={signupData.phone}
                    onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">
                    PIN de 4 dígitos o número de celular (será tu contraseña)
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
