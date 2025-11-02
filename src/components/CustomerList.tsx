import { useState, useEffect } from 'react';
import { User, Customer, getCustomers } from '../lib/api';
import { CustomerForm } from './CustomerForm';
import { CustomerDetail } from './CustomerDetail';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Plus, Eye, Edit, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CustomerListProps {
  user: User;
}

export function CustomerList({ user }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data.customers);
    } catch (error: any) {
      console.error('Error loading customers:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    loadCustomers();
  };

  if (loading) {
    return <div className="text-center py-8">Cargando clientes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl">Clientes</h2>
          <p className="text-sm text-gray-600">{customers.length} clientes registrados</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Button onClick={handleCreateCustomer}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-gray-500">
              No se encontraron clientes
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map(customer => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                    )}
                  </div>

                  {customer.address && (
                    <p className="text-sm text-gray-600 line-clamp-1">{customer.address}</p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewCustomer(customer)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditCustomer(customer)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Customer Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={selectedCustomer}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Información del Cliente</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <CustomerDetail customerId={selectedCustomer.id} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
