import { useState, useEffect } from 'react';
import { User, signup } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { projectId } from '../utils/supabase/info';

interface UserManagementProps {
  user: User;
}

const roleLabels: Record<string, string> = {
  vendedor: 'Vendedor',
  administrador: 'Administrador',
  propietario: 'Propietario',
};

const roleColors: Record<string, string> = {
  vendedor: 'bg-blue-100 text-blue-800',
  administrador: 'bg-purple-100 text-purple-800',
  propietario: 'bg-pink-100 text-pink-800',
};

export function UserManagement({ user }: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: 'vendedor',
    newPassword: '', // Para cambiar contraseña
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95aa99a4/users`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.role) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    // Validaciones
    if (!selectedUser && !formData.phone) {
      toast.error('El número/PIN es requerido para crear usuario');
      return;
    }

    if (!selectedUser && formData.phone.length < 4) {
      toast.error('El número/PIN debe tener al menos 4 dígitos');
      return;
    }

    try {
      if (selectedUser) {
        // Update user
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        };

        // Si se proporciona nueva contraseña, incluirla
        if (formData.newPassword && formData.newPassword.length >= 4) {
          updateData.newPassword = formData.newPassword;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-95aa99a4/users/${selectedUser.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update user');
        }

        toast.success('Usuario actualizado correctamente');
      } else {
        // Create new user
        await signup(formData.firstName, formData.lastName, formData.phone, formData.role);
        toast.success('Usuario creado correctamente');
      }

      setIsFormOpen(false);
      setFormData({ firstName: '', lastName: '', phone: '', role: 'vendedor', newPassword: '' });
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Error al guardar el usuario');
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    const nameParts = user.name.split(' ');
    setFormData({
      firstName: user.firstName || nameParts[0] || '',
      lastName: user.lastName || nameParts.slice(1).join(' ') || '',
      phone: user.phone || '',
      role: user.role,
      newPassword: '',
    });
    setIsFormOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95aa99a4/users/${deleteUserId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      toast.success('Usuario eliminado');
      setDeleteUserId(null);
      loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Error al eliminar el usuario');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando usuarios...</div>;
  }

  const canModifyUsers = user.role === 'propietario' || user.role === 'administrador';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="w-5 h-5" />
                Gestión de Usuarios
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{users.length} usuarios registrados</p>
            </div>
            {canModifyUsers && (
              <Button onClick={() => {
                setSelectedUser(null);
                setFormData({ firstName: '', lastName: '', phone: '', role: 'vendedor', newPassword: '' });
                setIsFormOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Número/PIN</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Creado</TableHead>
                  {canModifyUsers && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{u.phone || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[u.role]}>
                          {roleLabels[u.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(u.createdAt), "d MMM yyyy", { locale: es })}
                      </TableCell>
                      {canModifyUsers && (
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {/* Administradores no pueden editar propietarios */}
                            {!(user.role === 'administrador' && u.role === 'propietario') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(u)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {/* No puede eliminar a sí mismo, ni administradores pueden eliminar propietarios */}
                            {u.id !== user.id && !(user.role === 'administrador' && u.role === 'propietario') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteUserId(u.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? 'Modifica los datos del usuario seleccionado.'
                : 'Completa los datos para crear un nuevo usuario en el sistema.'}
            </DialogDescription>
          </DialogHeader>
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
              />
            </div>

            {!selectedUser && (
              <div className="space-y-2">
                <Label htmlFor="phone">Número/PIN *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1234 o 71234567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                  required
                />
                <p className="text-xs text-gray-500">
                  PIN de 4 dígitos o número de celular (será su contraseña)
                </p>
              </div>
            )}

            {selectedUser && (
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña (opcional)</Label>
                <Input
                  id="newPassword"
                  type="tel"
                  placeholder="1234 o nuevo número"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-xs text-gray-500">
                  Déjalo vacío para mantener la contraseña actual. Mínimo 4 dígitos.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  {user.role === 'propietario' && (
                    <SelectItem value="propietario">Propietario</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-600 space-y-1 mt-2">
                <p><strong>Vendedor:</strong> Gestiona pedidos y clientes</p>
                <p><strong>Administrador:</strong> Vendedor + reportes y usuarios</p>
                {user.role === 'propietario' && (
                  <p><strong>Propietario:</strong> Administrador + finanzas</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {selectedUser ? 'Actualizar' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente y no podrá acceder al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
