import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-95aa99a4`;

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'vendedor' | 'administrador' | 'propietario';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  deliveryDate: string;
  deliveryTime: string;
  description: string;
  images: string[];
  totalPrice: number;
  advance: number;
  pending: number;
  status: 'pendiente' | 'pendiente_confirmacion' | 'en_produccion' | 'listo' | 'entregado' | 'cancelado';
  paymentStatus: 'pendiente' | 'anticipo_recibido' | 'pagado';
  createdAt: string;
  publicOrderData?: {
    cakeType: string;
    cakeSize: string;
    decoration?: string;
    color?: string;
    flavor?: string;
    notes?: string;
  };
}

export interface Transaction {
  id: string;
  type: 'ingreso' | 'egreso';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Si es un error de autenticación, limpiar el token
      if (response.status === 401 || response.status === 403) {
        console.error('❌ Authentication error detected, clearing local token');
        setAuthToken(null);
      }
      const error = new Error(data.error || 'Request failed');
      (error as any).status = response.status;
      throw error;
    }

    return data;
  } catch (error: any) {
    // Si es un error de red (no Response), agregar más contexto
    if (error.message === 'Failed to fetch') {
      console.error(`❌ Network error calling ${endpoint}:`, error);
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
    throw error;
  }
}

// Auth APIs
export async function signup(firstName: string, lastName: string, phone: string, role?: string) {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ firstName, lastName, phone, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al crear la cuenta');
  }

  return data;
}

export async function getProfile(): Promise<{ user: User }> {
  return apiRequest('/profile');
}

// Customer APIs
export async function getCustomers(): Promise<{ customers: Customer[] }> {
  return apiRequest('/customers');
}

export async function getCustomer(id: string): Promise<{ customer: Customer; orders: Order[] }> {
  return apiRequest(`/customers/${id}`);
}

export async function createCustomer(data: Partial<Customer>): Promise<{ customer: Customer }> {
  return apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<{ customer: Customer }> {
  return apiRequest(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Order APIs
export async function getOrders(filters?: { status?: string; startDate?: string; endDate?: string }): Promise<{ orders: Order[] }> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  
  const query = params.toString();
  return apiRequest(`/orders${query ? `?${query}` : ''}`);
}

export async function getOrder(id: string): Promise<{ order: Order }> {
  return apiRequest(`/orders/${id}`);
}

export async function createOrder(data: Partial<Order>): Promise<{ order: Order }> {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<{ order: Order }> {
  return apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteOrder(id: string): Promise<{ success: boolean }> {
  return apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  });
}

// Transaction APIs
export async function getTransactions(filters?: { type?: string; startDate?: string; endDate?: string }): Promise<{ transactions: Transaction[] }> {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  
  const query = params.toString();
  return apiRequest(`/transactions${query ? `?${query}` : ''}`);
}

export async function createTransaction(data: Partial<Transaction>): Promise<{ transaction: Transaction }> {
  return apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteTransaction(id: string): Promise<{ success: boolean }> {
  return apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  });
}

// Reports API
export async function getReport(startDate: string, endDate: string) {
  const params = new URLSearchParams({ startDate, endDate });
  return apiRequest(`/reports?${params.toString()}`);
}

// Image upload API
export async function uploadImage(file: File): Promise<{ fileName: string; url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await apiRequest('/upload-image', {
          method: 'POST',
          body: JSON.stringify({
            fileName: file.name,
            fileData: reader.result as string,
            contentType: file.type,
          }),
        });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// User management APIs
export async function getUsers(): Promise<{ users: User[] }> {
  return apiRequest('/users');
}

export async function updateUserRole(userId: string, role: string): Promise<{ user: User }> {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  return apiRequest(`/users/${userId}`, {
    method: 'DELETE',
  });
}

// Public API (no authentication required)
export const api = {
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  },
};