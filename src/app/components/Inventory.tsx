import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '../lib/api';
import type { InventoryProduct as InvProduct, InventoryMovement as InvMovement } from '../lib/api';
import { supabase } from '../lib/supabase';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import {
  Plus, Minus, Search, AlertTriangle, History, Pencil, Trash2,
  MoreVertical, ArrowDownCircle, ArrowUpCircle, ShoppingCart,
  Copy, MessageCircle, RefreshCw, PackagePlus,
} from 'lucide-react';

interface Props { user: User; }
export type { InvProduct, InvMovement };

const FN_BASE = 'https://mwogpzhixkcrxwhvxdgc.supabase.co/functions/v1/make-server-95aa99a4';

async function invFetch(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('No hay sesión activa. Vuelve a iniciar sesión.');
  const res = await fetch(`${FN_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...(options.headers || {}) },
  });
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data.error || `Error ${res.status}`));
  return data;
}

const DEFAULT_CATEGORIES = [
  'Cajas para cupcakes', 'Bases doradas', 'Bases duroport',
  'Cajas blancas con ventana', 'Cajas Altas', 'Cajas Rojas', 'Otros',
];

function stockColor(p: InvProduct) {
  if (p.stock === 0) return { bg: 'bg-red-50', num: 'text-red-500', dot: 'bg-red-400', border: 'border-red-100' };
  if (p.stock <= p.minStock) return { bg: 'bg-amber-50', num: 'text-amber-500', dot: 'bg-amber-400', border: 'border-amber-100' };
  return { bg: 'bg-emerald-50', num: 'text-emerald-600', dot: 'bg-emerald-400', border: 'border-gray-100' };
}

type MovDlg = { open: false } | { open: true; product: InvProduct; type: 'entrada' | 'salida' };
type EditDlg = { open: false } | { open: true; product: InvProduct | null };
type DeleteDlg = { open: false } | { open: true; product: InvProduct };

export function Inventory({ user }: Props) {
  const canManage = user.role === 'administrador' || user.role === 'propietario';
  const [products, setProducts] = useState<InvProduct[]>([]);
  const [movements, setMovements] = useState<InvMovement[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [historyProduct, setHistoryProduct] = useState<InvProduct | null>(null);
  const [movDlg, setMovDlg] = useState<MovDlg>({ open: false });
  const [editDlg, setEditDlg] = useState<EditDlg>({ open: false });
  const [deleteDlg, setDeleteDlg] = useState<DeleteDlg>({ open: false });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [movQty, setMovQty] = useState('1');
  const [movNote, setMovNote] = useState('');
  const [editForm, setEditForm] = useState({ name: '', category: 'Otros', minStock: '5', unit: 'unidad', stock: '0' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ products: p }, { movements: m }] = await Promise.all([
        invFetch('/inventory/products'),
        invFetch('/inventory/movements?limit=200'),
      ]);
      setProducts(p);
      setMovements(m);
      // Build category list from existing products
      const cats = Array.from(new Set([...DEFAULT_CATEGORIES, ...p.map((x: InvProduct) => x.category)]));
      setCategories(cats);
    } catch (err: any) {
      toast.error('Error al cargar inventario: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!menuOpen) return;
    const h = () => setMenuOpen(null);
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, [menuOpen]);

  const filtered = useMemo(() =>
    products.filter(p => {
      const s = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const c = filterCat === 'all' || p.category === filterCat;
      return s && c;
    }), [products, search, filterCat]);

  const grouped = useMemo(() => {
    const map: Record<string, InvProduct[]> = {};
    for (const p of filtered) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    }
    return map;
  }, [filtered]);

  const lowCount = products.filter(p => p.stock <= p.minStock).length;
  const productHistory = useMemo(() =>
    historyProduct ? movements.filter(m => m.productId === historyProduct.id) : movements,
    [movements, historyProduct]);

  function openMov(product: InvProduct, type: 'entrada' | 'salida') {
    setMovDlg({ open: true, product, type });
    setMovQty('1');
    setMovNote('');
  }

  async function confirmMovement() {
    if (!movDlg.open) return;
    const qty = Number(movQty);
    if (!qty || qty <= 0) { toast.error('Ingresa una cantidad válida'); return; }
    const { product, type } = movDlg;
    if (type === 'salida' && product.stock < qty) { toast.error('Stock insuficiente'); return; }
    setSaving(true);
    try {
      const { newStock } = await invFetch('/inventory/movements', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, type, quantity: qty, note: movNote }),
      });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
      const { movements: m } = await invFetch('/inventory/movements?limit=200');
      setMovements(m);
      toast.success(type === 'entrada' ? `+${qty} unidades agregadas` : `-${qty} unidades descontadas`);
      setMovDlg({ open: false });
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  function openEdit(product: InvProduct | null) {
    setMenuOpen(null);
    setEditForm(product
      ? { name: product.name, category: product.category, minStock: String(product.minStock), unit: product.unit, stock: String(product.stock) }
      : { name: '', category: categories[0] || 'Otros', minStock: '5', unit: 'unidad', stock: '0' }
    );
    setEditDlg({ open: true, product });
  }

  async function saveEdit() {
    if (!editForm.name.trim()) { toast.error('El nombre es requerido'); return; }
    setSaving(true);
    try {
      if (editDlg.open && editDlg.product) {
        const { product } = await invFetch(`/inventory/products/${editDlg.product.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: editForm.name, category: editForm.category, minStock: Number(editForm.minStock), unit: editForm.unit }),
        });
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        toast.success('Producto actualizado');
      } else {
        const { product } = await invFetch('/inventory/products', {
          method: 'POST',
          body: JSON.stringify({ name: editForm.name, category: editForm.category, stock: Number(editForm.stock), minStock: Number(editForm.minStock), unit: editForm.unit }),
        });
        setProducts(prev => [...prev, product].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)));
        if (!categories.includes(editForm.category)) setCategories(prev => [...prev, editForm.category]);
        toast.success('Producto agregado');
      }
      setEditDlg({ open: false });
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteDlg.open) return;
    setSaving(true);
    try {
      await invFetch(`/inventory/products/${deleteDlg.product.id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== deleteDlg.product.id));
      toast.success('Producto eliminado');
      setDeleteDlg({ open: false });
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  }

  function addCategory() {
    const cat = newCategory.trim();
    if (!cat) return;
    if (categories.includes(cat)) { toast.error('Esa categoría ya existe'); return; }
    setCategories(prev => [...prev, cat]);
    setNewCategory('');
    setShowAddCategory(false);
    toast.success(`Categoría "${cat}" agregada`);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="w-6 h-6 text-gray-300 animate-spin" />
        <p className="text-sm text-gray-400">Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex gap-2 flex-1">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <Input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white border-gray-200 rounded-xl h-10 text-sm" />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-28 sm:w-36 bg-white border-gray-200 rounded-xl h-10 text-sm">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowShoppingList(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 h-10 rounded-xl transition-colors">
            <ShoppingCart className="w-4 h-4" /><span className="hidden sm:inline">Compras</span>
          </button>
          {canManage && (
            <>
              <button onClick={() => setShowAddCategory(true)}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 h-10 rounded-xl transition-colors"
                title="Nueva categoría">
                <Plus className="w-4 h-4" /><span className="hidden sm:inline">Categoría</span>
              </button>
              <button onClick={() => openEdit(null)}
                className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 h-10 rounded-xl transition-colors">
                <PackagePlus className="w-4 h-4" /><span>Nuevo producto</span>
              </button>
            </>
          )}
          <button onClick={loadData} title="Actualizar"
            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-500">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{products.length} productos</span>
        {lowCount > 0 && (
          <span className="text-xs text-amber-700 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />{lowCount} con stock bajo
          </span>
        )}
        {movements.length > 0 && (
          <button onClick={() => { setHistoryProduct(null); setShowHistory(true); }}
            className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-100 transition-colors">
            <History className="w-3 h-3" /> Ver movimientos
          </button>
        )}
      </div>

      {/* Product grid */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No se encontraron productos</div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{category}</span>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-300">{items.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {items.map(product => {
                const c = stockColor(product);
                return (
                  <div key={product.id} className={`bg-white rounded-2xl border ${c.border} shadow-sm flex flex-col overflow-visible`}>
                    <div className="flex items-center justify-between px-3 pt-2 pb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                      {canManage && (
                        <div className="relative">
                          <button
                            onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === product.id ? null : product.id); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {menuOpen === product.id && (
                            <div className="absolute right-0 top-8 z-30 bg-white border border-gray-100 rounded-xl shadow-xl py-1 w-36 text-sm" onClick={e => e.stopPropagation()}>
                              <button onClick={() => { setHistoryProduct(product); setShowHistory(true); setMenuOpen(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700">
                                <History className="w-3.5 h-3.5 text-gray-400" /> Historial
                              </button>
                              <button onClick={() => openEdit(product)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700">
                                <Pencil className="w-3.5 h-3.5 text-gray-400" /> Editar
                              </button>
                              <button onClick={() => { setMenuOpen(null); setDeleteDlg({ open: true, product }); }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-500">
                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="px-3 pb-1 text-xs font-medium text-gray-700 leading-tight line-clamp-2 min-h-[2rem]">{product.name}</p>
                    <div className={`mx-3 my-1.5 rounded-xl ${c.bg} flex flex-col items-center justify-center py-2.5`}>
                      <span className={`text-4xl font-bold tabular-nums leading-none ${c.num}`}>{product.stock}</span>
                      <span className="text-[10px] text-gray-400 mt-1">{product.unit}s</span>
                    </div>
                    <div className="flex border-t border-gray-100 mt-auto">
                      <button onClick={() => openMov(product, 'salida')} disabled={saving}
                        className={`flex-1 flex items-center justify-center py-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 ${canManage ? 'rounded-bl-2xl' : 'rounded-b-2xl'}`}>
                        <Minus className="w-5 h-5" />
                      </button>
                      {canManage && (
                        <>
                          <div className="w-px bg-gray-100" />
                          <button onClick={() => openMov(product, 'entrada')} disabled={saving}
                            className="flex-1 flex items-center justify-center py-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40 rounded-br-2xl">
                            <Plus className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}

      {/* Movement Dialog */}
      <Dialog open={movDlg.open} onOpenChange={open => !open && setMovDlg({ open: false })}>
        <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              {movDlg.open && movDlg.type === 'entrada'
                ? <><ArrowDownCircle className="w-5 h-5 text-emerald-500" /> Entrada de stock</>
                : <><ArrowUpCircle className="w-5 h-5 text-red-400" /> Salida de stock</>}
            </DialogTitle>
          </DialogHeader>
          {movDlg.open && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-400">Producto</p>
                <p className="font-semibold text-gray-900 text-sm mt-0.5">{movDlg.product.name}</p>
                <p className="text-xs text-gray-400 mt-1">Stock actual: <span className="font-bold text-gray-800">{movDlg.product.stock}</span></p>
              </div>
              <div>
                <p className="text-xs text-center text-gray-500 mb-2">Cantidad</p>
                <div className="grid gap-2" style={{ gridTemplateColumns: '2.75rem 1fr 2.75rem' }}>
                  <button onClick={() => setMovQty(v => String(Math.max(1, Number(v) - 1)))}
                    className="h-11 rounded-xl bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-300 transition-colors select-none">−</button>
                  <input type="number" min="1" value={movQty} onChange={e => setMovQty(e.target.value)}
                    className="w-full text-center text-3xl font-bold text-gray-900 bg-white border border-gray-200 rounded-xl h-11 focus:outline-none focus:ring-2 focus:ring-gray-300" />
                  <button onClick={() => setMovQty(v => String(Number(v) + 1))}
                    className="h-11 rounded-xl bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-300 transition-colors select-none">+</button>
                </div>
              </div>
              <Input placeholder="Nota (opcional)" value={movNote} onChange={e => setMovNote(e.target.value)}
                className="rounded-xl border-gray-200 text-sm" />
              <button onClick={confirmMovement} disabled={saving || !movQty || Number(movQty) <= 0}
                className={`w-full h-12 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-40
                  ${movDlg.type === 'entrada' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-400 hover:bg-red-500'}`}>
                {saving ? 'Guardando...' : movDlg.type === 'entrada' ? `Confirmar +${movQty}` : `Confirmar −${movQty}`}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit / New Product Dialog */}
      <Dialog open={editDlg.open} onOpenChange={open => !open && setEditDlg({ open: false })}>
        <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editDlg.open && editDlg.product ? 'Editar producto' : 'Nuevo producto'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div>
              <Label className="text-xs text-gray-500">Nombre *</Label>
              <Input autoFocus placeholder="Ej: Caja roja #10" value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="mt-1 rounded-xl border-gray-200" />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Categoría</Label>
              <Select value={editForm.category} onValueChange={v => setEditForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="mt-1 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {!(editDlg.open && editDlg.product) && (
                <div>
                  <Label className="text-xs text-gray-500">Stock inicial</Label>
                  <Input type="number" min="0" value={editForm.stock}
                    onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
                    className="mt-1 rounded-xl border-gray-200" />
                </div>
              )}
              <div>
                <Label className="text-xs text-gray-500">Stock mínimo</Label>
                <Input type="number" min="0" value={editForm.minStock}
                  onChange={e => setEditForm(f => ({ ...f, minStock: e.target.value }))}
                  className="mt-1 rounded-xl border-gray-200" />
              </div>
              <div className={!(editDlg.open && editDlg.product) ? '' : 'col-span-2'}>
                <Label className="text-xs text-gray-500">Unidad</Label>
                <Input placeholder="unidad" value={editForm.unit}
                  onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}
                  className="mt-1 rounded-xl border-gray-200" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setEditDlg({ open: false })}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDlg.open} onOpenChange={open => !open && setDeleteDlg({ open: false })}>
        <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-gray-900">Eliminar producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="bg-red-50 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-700">¿Estás seguro de que quieres eliminar:</p>
              <p className="font-bold text-gray-900 mt-1">{deleteDlg.open ? deleteDlg.product.name : ''}</p>
            </div>
            <p className="text-xs text-gray-400">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteDlg({ open: false })}
                className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={confirmDelete} disabled={saving}
                className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {saving ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Nueva categoría</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div>
              <Label className="text-xs text-gray-500">Nombre de la categoría *</Label>
              <Input autoFocus placeholder="Ej: Cajas especiales" value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCategory()}
                className="mt-1 rounded-xl border-gray-200" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddCategory(false)}
                className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={addCategory}
                className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                Agregar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shopping List Dialog */}
      <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
        <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-sm rounded-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <ShoppingCart className="w-4 h-4 text-emerald-600" /> Lista de compras
            </DialogTitle>
          </DialogHeader>
          {(() => {
            const lowItems = products.filter(p => p.stock <= p.minStock).sort((a, b) => a.category.localeCompare(b.category));
            const listText = lowItems.length === 0 ? 'Todo el inventario está bien abastecido ✓' :
              `🛒 Lista de compras\n\n` + lowItems.map(p => `• ${p.name}: ${p.stock === 0 ? 'AGOTADO' : `solo ${p.stock} ${p.unit}s`}`).join('\n');
            return lowItems.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-medium text-gray-700">Todo bien abastecido</p>
                <p className="text-sm text-gray-400 mt-1">No hay productos con stock bajo</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 min-h-0">
                <p className="text-xs text-gray-400">{lowItems.length} producto{lowItems.length > 1 ? 's' : ''} necesitan reposición</p>
                <div className="overflow-y-auto flex-1 space-y-1.5">
                  {lowItems.map(p => (
                    <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${p.stock === 0 ? 'bg-red-50' : 'bg-amber-50'}`}>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                        {p.stock === 0 ? 'AGOTADO' : `${p.stock} restantes`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => { navigator.clipboard.writeText(listText); toast.success('Lista copiada'); }}
                    className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-700 text-sm flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
                    <Copy className="w-4 h-4" /> Copiar
                  </button>
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(listText)}`, '_blank')}
                    className="flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm flex items-center justify-center gap-1.5 transition-colors">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={open => { if (!open) { setShowHistory(false); setHistoryProduct(null); } }}>
        <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-sm rounded-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              {historyProduct ? historyProduct.name : 'Todos los movimientos'}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 -mx-6 px-6 mt-1">
            {productHistory.length === 0 ? (
              <p className="text-center py-10 text-sm text-gray-400">Sin movimientos aún</p>
            ) : productHistory.map(m => (
              <div key={m.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${m.type === 'entrada' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {m.type === 'entrada' ? <Plus className="w-4 h-4 text-emerald-600" /> : <Minus className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  {!historyProduct && <p className="text-xs font-medium text-gray-700 truncate">{m.productName}</p>}
                  <p className={`font-bold text-sm ${m.type === 'entrada' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {m.type === 'entrada' ? '+' : '−'}{m.quantity}
                  </p>
                  {m.note && <p className="text-xs text-gray-400 truncate">{m.note}</p>}
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0 text-right leading-tight">
                  {new Date(m.createdAt).toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit' })}
                  <br />
                  <span className="text-gray-400">{new Date(m.createdAt).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
