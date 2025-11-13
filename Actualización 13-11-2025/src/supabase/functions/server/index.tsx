import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase clients
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Helper to get authenticated user
async function getAuthenticatedUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }

  return user;
}

// Initialize storage bucket on startup
(async () => {
  try {
    const bucketName = 'make-95aa99a4-images';
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
})();

// Health check endpoint
app.get("/make-server-95aa99a4/health", (c) => {
  return c.json({ status: "ok" });
});

// Check if setup is needed (no users exist)
app.get("/make-server-95aa99a4/check-setup", async (c) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Check setup error:', error);
      return c.json({ needsSetup: true });
    }

    console.log('Setup check:', {
      totalUsers: data.users.length,
      users: data.users.map(u => ({ email: u.email, role: u.user_metadata?.role }))
    });

    return c.json({ 
      needsSetup: data.users.length === 0
    });
  } catch (error: any) {
    console.error('Check setup error:', error);
    return c.json({ needsSetup: true });
  }
});

// ==================== AUTH ENDPOINTS ====================

// Signup endpoint (public - no auth required)
app.post("/make-server-95aa99a4/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, phone, role } = body;

    if (!firstName || !lastName || !phone) {
      return c.json({ error: 'Nombre, apellido y número/PIN son requeridos' }, 400);
    }

    // Allow 4+ digits
    if (phone.length < 4) {
      return c.json({ error: 'El número/PIN debe tener al menos 4 dígitos' }, 400);
    }

    const email = `${phone}@pasteleria.local`;
    
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return c.json({ error: 'Error al verificar usuarios' }, 500);
    }
    
    // Check for duplicate phone/email
    const phoneExists = existingUsers?.users.some(u => 
      u.user_metadata?.phone === phone || u.email === email
    );
    if (phoneExists) {
      return c.json({ error: 'Este número/PIN ya está registrado' }, 400);
    }

    // Determine role: first user is owner, or use provided role (for admin)
    let userRole = 'vendedor';
    const hasOwner = existingUsers?.users.some(u => u.user_metadata?.role === 'propietario');
    
    // Get the authenticated user if present (for user creation by admin/propietario)
    const authenticatedUser = await getAuthenticatedUser(c.req.raw);
    const creatorRole = authenticatedUser?.user_metadata?.role;
    
    if (!hasOwner) {
      // First user is always propietario
      userRole = 'propietario';
    } else if (role && ['vendedor', 'administrador', 'propietario'].includes(role)) {
      // If creator is administrador, they can only create vendedor or administrador
      if (creatorRole === 'administrador' && role === 'propietario') {
        return c.json({ error: 'Administradores no pueden crear usuarios con rol de propietario' }, 403);
      }
      userRole = role;
    }

    // Para PINs de 4 dígitos, agregar prefijo para cumplir requisitos de Supabase
    const password = phone.length === 4 ? `pin${phone}` : phone;
    const name = `${firstName} ${lastName}`;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, firstName, lastName, phone, role: userRole },
      email_confirm: true
    });

    if (error) {
      console.error('Create user error:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('User created successfully:', {
      email,
      role: userRole,
      phoneLength: phone.length,
      userId: data.user.id
    });

    return c.json({ 
      user: data.user,
      role: userRole,
      message: 'Cuenta creada exitosamente'
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Error al crear la cuenta' }, 500);
  }
});

// Get user profile
app.get("/make-server-95aa99a4/profile", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || '',
        phone: user.user_metadata?.phone || '',
        role: user.user_metadata?.role || 'vendedor',
      }
    });
  } catch (error: any) {
    console.error('Profile error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== CUSTOMER ENDPOINTS ====================

// Get all customers
app.get("/make-server-95aa99a4/customers", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const customers = await kv.getByPrefix('customer:');
    return c.json({ customers });
  } catch (error: any) {
    console.error('Get customers error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get single customer with orders
app.get("/make-server-95aa99a4/customers/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const customerId = c.req.param('id');
    const customer = await kv.get(`customer:${customerId}`);
    
    if (!customer) {
      return c.json({ error: 'Customer not found' }, 404);
    }

    // Get all orders for this customer
    const allOrders = await kv.getByPrefix('order:');
    const customerOrders = allOrders.filter((order: any) => order.customerId === customerId);

    return c.json({ customer, orders: customerOrders });
  } catch (error: any) {
    console.error('Get customer error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create customer
app.post("/make-server-95aa99a4/customers", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await c.req.json();
    const id = crypto.randomUUID();
    
    const customer = {
      id,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      address: data.address || '',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`customer:${id}`, customer);
    return c.json({ customer });
  } catch (error: any) {
    console.error('Create customer error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update customer
app.put("/make-server-95aa99a4/customers/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const customerId = c.req.param('id');
    const existing = await kv.get(`customer:${customerId}`);
    
    if (!existing) {
      return c.json({ error: 'Customer not found' }, 404);
    }

    const data = await c.req.json();
    const customer = {
      ...existing,
      ...data,
      id: customerId,
      createdAt: existing.createdAt,
    };

    await kv.set(`customer:${customerId}`, customer);
    return c.json({ customer });
  } catch (error: any) {
    console.error('Update customer error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== ORDER ENDPOINTS ====================

// Get all orders with filters
app.get("/make-server-95aa99a4/orders", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const status = c.req.query('status');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    let orders = await kv.getByPrefix('order:');

    // Apply filters
    if (status) {
      orders = orders.filter((order: any) => order.status === status);
    }
    if (startDate) {
      orders = orders.filter((order: any) => order.deliveryDate >= startDate);
    }
    if (endDate) {
      orders = orders.filter((order: any) => order.deliveryDate <= endDate);
    }

    // Sort by delivery date
    orders.sort((a: any, b: any) => {
      const dateA = new Date(a.deliveryDate + 'T' + a.deliveryTime);
      const dateB = new Date(b.deliveryDate + 'T' + b.deliveryTime);
      return dateA.getTime() - dateB.getTime();
    });

    return c.json({ orders });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get single order
app.get("/make-server-95aa99a4/orders/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orderId = c.req.param('id');
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    return c.json({ order });
  } catch (error: any) {
    console.error('Get order error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create order
app.post("/make-server-95aa99a4/orders", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await c.req.json();
    const id = crypto.randomUUID();
    
    const totalPrice = parseFloat(data.totalPrice) || 0;
    const advance = parseFloat(data.advance) || 0;
    
    const order = {
      id,
      customerId: data.customerId,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      description: data.description,
      images: data.images || [],
      totalPrice,
      advance,
      pending: totalPrice - advance,
      status: data.status || 'pendiente',
      paymentStatus: data.paymentStatus || 'pendiente',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`order:${id}`, order);
    return c.json({ order });
  } catch (error: any) {
    console.error('Create order error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update order
app.put("/make-server-95aa99a4/orders/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orderId = c.req.param('id');
    const existing = await kv.get(`order:${orderId}`);
    
    if (!existing) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const data = await c.req.json();
    const totalPrice = parseFloat(data.totalPrice ?? existing.totalPrice);
    const advance = parseFloat(data.advance ?? existing.advance);
    
    // Auto-confirm order when price is assigned by owner
    let status = data.status ?? existing.status;
    const userRole = user.user_metadata?.role;
    
    // If order is pending confirmation and owner assigns a price > 0, auto-confirm
    if (
      existing.status === 'pendiente_confirmacion' && 
      userRole === 'propietario' &&
      totalPrice > 0 &&
      data.totalPrice !== undefined // Price was explicitly updated
    ) {
      status = 'pendiente';
      console.log(`Auto-confirming order ${orderId}: price assigned by owner`);
    }
    
    const order = {
      ...existing,
      ...data,
      id: orderId,
      totalPrice,
      advance,
      pending: totalPrice - advance,
      status,
      createdAt: existing.createdAt,
    };

    await kv.set(`order:${orderId}`, order);
    return c.json({ order });
  } catch (error: any) {
    console.error('Update order error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete order
app.delete("/make-server-95aa99a4/orders/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (!['administrador', 'propietario'].includes(role)) {
      return c.json({ error: 'Forbidden: insufficient permissions' }, 403);
    }

    const orderId = c.req.param('id');
    await kv.del(`order:${orderId}`);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Delete order error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== PUBLIC ORDER ENDPOINT ====================

// Create public order (no authentication required)
app.post("/make-server-95aa99a4/public-order", async (c) => {
  try {
    const body = await c.req.json();
    const { customer, order } = body;

    console.log('=== PUBLIC ORDER REQUEST ===');
    console.log('Customer:', { name: customer.name, lastName: customer.lastName, phone: customer.phone });
    console.log('Order data:', {
      cakeType: order.cakeType,
      cakeSize: order.cakeSize,
      hasImages: !!order.referenceImages,
      imagesCount: order.referenceImages?.length || 0
    });

    // Find or create customer
    let customerId = '';
    const existingCustomers = await kv.getByPrefix('customer:');
    const existingCustomer = existingCustomers.find((c: any) => c.phone === customer.phone);

    if (existingCustomer) {
      customerId = existingCustomer.id;
      console.log('Found existing customer:', customerId);
    } else {
      customerId = crypto.randomUUID();
      const newCustomer = {
        id: customerId,
        name: `${customer.name} ${customer.lastName}`.trim(),
        phone: customer.phone,
        email: '',
        address: '',
        createdAt: new Date().toISOString(),
        source: 'public_form', // Mark as created from public form
      };
      await kv.set(`customer:${customerId}`, newCustomer);
      console.log('Created new customer:', customerId);
    }

    // Upload reference images to storage if provided
    const uploadedImageUrls: string[] = [];
    if (order.referenceImages && order.referenceImages.length > 0) {
      const bucketName = 'make-95aa99a4-images';
      console.log(`\n=== IMAGE UPLOAD START ===`);
      console.log(`Total images to process: ${order.referenceImages.length}`);
      
      // Generate base timestamp outside the loop to ensure uniqueness
      const baseTimestamp = Date.now();
      
      for (let i = 0; i < order.referenceImages.length; i++) {
        try {
          console.log(`\n--- Processing image ${i + 1}/${order.referenceImages.length} ---`);
          const imageData = order.referenceImages[i];
          console.log(`Image ${i + 1} data length: ${imageData?.length || 0} chars`);
          
          if (!imageData || typeof imageData !== 'string') {
            console.error(`Image ${i + 1} is invalid (not a string or empty)`);
            continue;
          }
          
          const base64Data = imageData.split(',')[1];
          if (!base64Data) {
            console.error(`Image ${i + 1} has no base64 data after split`);
            continue;
          }
          
          console.log(`Image ${i + 1} base64 length: ${base64Data.length} chars`);
          const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          console.log(`Image ${i + 1} buffer size: ${buffer.length} bytes`);
          
          // Add small delay to ensure unique timestamp + use random component for extra uniqueness
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const fileName = `public-order-${baseTimestamp}-${i}-${randomSuffix}.jpg`;
          
          console.log(`Uploading image ${i + 1} to: ${fileName}`);
          const { data, error } = await supabaseAdmin.storage
            .from(bucketName)
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: false,
            });

          if (error) {
            console.error(`❌ Error uploading image ${i + 1}:`, error);
            continue;
          }
          
          console.log(`✅ Image ${i + 1} uploaded successfully, getting signed URL...`);
          // Get signed URL (valid for 10 years)
          const { data: urlData, error: urlError } = await supabaseAdmin.storage
            .from(bucketName)
            .createSignedUrl(fileName, 315360000);
          
          if (urlError) {
            console.error(`❌ Error creating signed URL for image ${i + 1}:`, urlError);
            continue;
          }
          
          if (urlData?.signedUrl) {
            uploadedImageUrls.push(urlData.signedUrl);
            console.log(`✅ Image ${i + 1} processed successfully, signed URL created`);
            console.log(`Total URLs collected so far: ${uploadedImageUrls.length}`);
          } else {
            console.error(`❌ No signed URL returned for image ${i + 1}`);
          }
        } catch (imgError) {
          console.error(`❌ Exception while processing image ${i + 1}:`, imgError);
          // Continue even if one image fails
        }
      }
      
      console.log(`\n=== IMAGE UPLOAD COMPLETE ===`);
      console.log(`Successfully uploaded ${uploadedImageUrls.length} of ${order.referenceImages.length} images`);
      console.log(`Final image URLs count: ${uploadedImageUrls.length}`);
    }

    // Create order with special status
    const orderId = crypto.randomUUID();
    const newOrder = {
      id: orderId,
      customerId,
      deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : '',
      deliveryTime: order.deliveryTime || '',
      description: `${order.cakeType} - ${order.cakeSize}\n` +
                   `Decoración: ${order.decoration || 'No especificada'}\n` +
                   `Color: ${order.color || 'No especificado'}\n` +
                   `Sabor: ${order.flavor || 'No especificado'}\n` +
                   `Notas: ${order.notes || 'Ninguna'}`,
      images: uploadedImageUrls,
      totalPrice: 0, // To be filled by propietario
      advance: 0,
      pending: 0,
      status: 'pendiente_confirmacion', // Special status for public orders
      paymentStatus: 'pendiente',
      createdAt: new Date().toISOString(),
      publicOrderData: {
        cakeType: order.cakeType,
        cakeSize: order.cakeSize,
        decoration: order.decoration,
        color: order.color,
        flavor: order.flavor,
        notes: order.notes,
      },
    };

    console.log(`\n=== SAVING ORDER ===`);
    console.log(`Order ID: ${orderId}`);
    console.log(`Images in order: ${newOrder.images.length}`);
    
    await kv.set(`order:${orderId}`, newOrder);
    console.log('✅ Public order created successfully');

    return c.json({ 
      success: true,
      orderId,
      customerId,
      imagesUploaded: uploadedImageUrls.length,
      imageUrls: uploadedImageUrls, // Include the image URLs in the response
      message: 'Pedido creado exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Create public order error:', error);
    return c.json({ 
      error: error.message || 'Error al crear el pedido',
      success: false 
    }, 500);
  }
});

// ==================== TRANSACTION ENDPOINTS ====================

// Get all transactions with filters
app.get("/make-server-95aa99a4/transactions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (role !== 'propietario') {
      return c.json({ error: 'Forbidden: only propietario can access finances' }, 403);
    }

    const type = c.req.query('type');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    let transactions = await kv.getByPrefix('transaction:');

    // Apply filters
    if (type) {
      transactions = transactions.filter((t: any) => t.type === type);
    }
    if (startDate) {
      transactions = transactions.filter((t: any) => t.date >= startDate);
    }
    if (endDate) {
      transactions = transactions.filter((t: any) => t.date <= endDate);
    }

    // Sort by date descending
    transactions.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return c.json({ transactions });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create transaction
app.post("/make-server-95aa99a4/transactions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (role !== 'propietario') {
      return c.json({ error: 'Forbidden: only propietario can access finances' }, 403);
    }

    const data = await c.req.json();
    const id = crypto.randomUUID();
    
    const transaction = {
      id,
      type: data.type,
      category: data.category,
      amount: parseFloat(data.amount),
      description: data.description,
      date: data.date,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`transaction:${id}`, transaction);
    return c.json({ transaction });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete transaction
app.delete("/make-server-95aa99a4/transactions/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (role !== 'propietario') {
      return c.json({ error: 'Forbidden: only propietario can access finances' }, 403);
    }

    const transactionId = c.req.param('id');
    await kv.del(`transaction:${transactionId}`);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Delete transaction error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== REPORTS ENDPOINT ====================

app.get("/make-server-95aa99a4/reports", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (!['administrador', 'propietario'].includes(role)) {
      return c.json({ error: 'Forbidden: insufficient permissions' }, 403);
    }

    const startDate = c.req.query('startDate') || '';
    const endDate = c.req.query('endDate') || '';

    // Get orders in date range
    let orders = await kv.getByPrefix('order:');
    orders = orders.filter((order: any) => {
      const orderDate = order.deliveryDate;
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Get transactions in date range
    let transactions = await kv.getByPrefix('transaction:');
    transactions = transactions.filter((t: any) => {
      return t.date >= startDate && t.date <= endDate;
    });

    // Calculate order stats
    const totalOrders = orders.length;
    const ordersByStatus = orders.reduce((acc: any, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const totalSales = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
    const totalAdvances = orders.reduce((sum: number, order: any) => sum + order.advance, 0);
    const totalPending = orders.reduce((sum: number, order: any) => sum + order.pending, 0);

    // Calculate transaction stats
    const ingresos = transactions
      .filter((t: any) => t.type === 'ingreso')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const egresos = transactions
      .filter((t: any) => t.type === 'egreso')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    // Calculate by category
    const egresosByCategory = transactions
      .filter((t: any) => t.type === 'egreso')
      .reduce((acc: any, t: any) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Calculate net profit (sales + other income - expenses)
    const totalIncome = totalSales + ingresos;
    const netProfit = totalIncome - egresos;

    return c.json({
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus,
        totalSales,
        totalAdvances,
        totalPending,
      },
      finances: {
        totalIncome,
        totalSales,
        otherIncome: ingresos,
        totalExpenses: egresos,
        expensesByCategory: egresosByCategory,
        netProfit,
      },
    });
  } catch (error: any) {
    console.error('Get reports error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== IMAGE UPLOAD ENDPOINT ====================

app.post("/make-server-95aa99a4/upload-image", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { fileName, fileData, contentType } = await c.req.json();
    
    // Extract base64 data
    const base64Data = fileData.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const bucketName = 'make-95aa99a4-images';

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(uniqueFileName, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: error.message }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: urlData, error: urlError } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUrl(uniqueFileName, 315360000); // 10 years in seconds

    if (urlError) {
      console.error('Signed URL error:', urlError);
      return c.json({ error: urlError.message }, 500);
    }

    return c.json({
      fileName: uniqueFileName,
      url: urlData.signedUrl,
    });
  } catch (error: any) {
    console.error('Upload image error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== USER MANAGEMENT ENDPOINTS ====================

// Get all users
app.get("/make-server-95aa99a4/users", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (!['administrador', 'propietario'].includes(role)) {
      return c.json({ error: 'Forbidden: insufficient permissions' }, 403);
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('List users error:', error);
      return c.json({ error: error.message }, 500);
    }

    const users = data.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || '',
      firstName: u.user_metadata?.firstName || '',
      lastName: u.user_metadata?.lastName || '',
      phone: u.user_metadata?.phone || '',
      role: u.user_metadata?.role || 'vendedor',
      createdAt: u.created_at,
    }));

    return c.json({ users });
  } catch (error: any) {
    console.error('Get users error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update user (role, name, password)
app.put("/make-server-95aa99a4/users/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (!['administrador', 'propietario'].includes(role)) {
      return c.json({ error: 'Forbidden: only propietario and administrador can modify users' }, 403);
    }

    const userId = c.req.param('id');
    const { role: newRole, firstName, lastName, newPassword } = await c.req.json();

    // Validate role if provided
    if (newRole && !['vendedor', 'administrador', 'propietario'].includes(newRole)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    // Administradores no pueden cambiar roles a propietario
    if (role === 'administrador' && newRole === 'propietario') {
      return c.json({ error: 'Administradores no pueden asignar rol de propietario' }, 403);
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Administradores no pueden modificar propietarios
    if (role === 'administrador' && userData.user.user_metadata?.role === 'propietario') {
      return c.json({ error: 'Administradores no pueden modificar usuarios propietarios' }, 403);
    }

    // Build update object
    const updateData: any = {
      user_metadata: {
        ...userData.user.user_metadata,
      },
    };

    // Update name if provided
    if (firstName && lastName) {
      updateData.user_metadata.firstName = firstName;
      updateData.user_metadata.lastName = lastName;
      updateData.user_metadata.name = `${firstName} ${lastName}`;
    }

    // Update role if provided
    if (newRole) {
      updateData.user_metadata.role = newRole;
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 4) {
        return c.json({ error: 'La nueva contraseña debe tener al menos 4 dígitos' }, 400);
      }
      // Agregar prefijo si es PIN de 4 dígitos
      updateData.password = newPassword.length === 4 ? `pin${newPassword}` : newPassword;
      updateData.user_metadata.phone = newPassword;
      
      // Update email to match new phone
      updateData.email = `${newPassword}@pasteleria.local`;
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, updateData);

    if (error) {
      console.error('Update user error:', error);
      return c.json({ error: error.message }, 500);
    }

    console.log('User updated successfully:', {
      userId,
      updatedFields: Object.keys(updateData),
      hasNewPassword: !!newPassword,
    });

    return c.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'vendedor',
      }
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete user
app.delete("/make-server-95aa99a4/users/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (!['administrador', 'propietario'].includes(role)) {
      return c.json({ error: 'Forbidden: only propietario and administrador can delete users' }, 403);
    }

    const userId = c.req.param('id');
    
    // Prevent deleting yourself
    if (userId === user.id) {
      return c.json({ error: 'Cannot delete your own account' }, 400);
    }

    // Get the user to be deleted
    const { data: targetUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (getUserError || !targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Prevent administradores from deleting propietarios
    if (role === 'administrador' && targetUser.user.user_metadata?.role === 'propietario') {
      return c.json({ error: 'Administradores no pueden eliminar propietarios' }, 403);
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Delete user error:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);