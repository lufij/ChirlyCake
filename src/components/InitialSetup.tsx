import { useState } from 'react';
import { signup } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { Cake, ArrowRight } from 'lucide-react';

interface InitialSetupProps {
  onComplete: () => void;
}

export function InitialSetup({ onComplete }: InitialSetupProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (formData.phone.length < 8) {
      toast.error('El número de celular debe tener al menos 8 dígitos');
      return;
    }

    setLoading(true);
    let vendedorCreated = false;
    
    try {
      console.log('Creating propietario account...');
      // Crear cuenta del propietario
      const ownerResult = await signup(formData.firstName, formData.lastName, formData.phone, 'propietario');
      console.log('Propietario created:', ownerResult);
      
      // Esperar un poco para asegurar que el propietario se creó correctamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Now creating vendedor account...');
      // Crear cuenta compartida de vendedor con PIN 1234 por defecto
      try {
        const vendedorResult = await signup('Vendedor', 'Compartido', '1234', 'vendedor');
        console.log('Vendedor account created successfully:', vendedorResult);
        vendedorCreated = true;
        
        toast.success('¡Configuración completa!', {
          description: 'Usuario vendedor creado con PIN: 1234',
          duration: 5000,
        });
      } catch (vendedorError: any) {
        console.error('Error creating vendedor account:', vendedorError);
        console.error('Vendedor error details:', {
          message: vendedorError.message,
          response: vendedorError.response,
        });
        
        toast.warning('Cuenta de propietario creada correctamente', {
          description: 'Por favor, crea el usuario vendedor manualmente desde Gestión de Usuarios',
          duration: 6000,
        });
      }
      
      setTimeout(() => {
        onComplete();
      }, vendedorCreated ? 2000 : 3000);
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-4 rounded-full">
              <Cake className="w-10 h-10 text-pink-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Bienvenido a tu Pastelería</CardTitle>
          <CardDescription>
            Configura tu cuenta de propietario para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Juan"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Pérez"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Número de Celular *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="71234567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Este número será tu contraseña de acceso
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">✨ Tu pastelería incluye:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Cuenta de propietario (tú) con acceso completo</li>
                <li>Usuario vendedor compartido (PIN inicial: <strong>1234</strong>)</li>
                <li>Gestión de pedidos, clientes y finanzas</li>
                <li>Podrás cambiar el PIN desde gestión de usuarios</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                'Creando cuenta...'
              ) : (
                <>
                  Crear Cuenta de Propietario
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
