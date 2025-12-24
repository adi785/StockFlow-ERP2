import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useERPStore } from '@/store/erpStore';
import { formatCurrency, generateProductId } from '@/lib/formatters';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/erp';
import { categories, brands } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Products = () => {
  const products = useERPStore((state) => state.products);
  const addProduct = useERPStore((state) => state.addProduct);
  const updateProduct = useERPStore((state) => state.updateProduct);
  const deleteProduct = useERPStore((state) => state.deleteProduct);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: generateProductId(products.length + 1),
    name: '',
    brand: '',
    category: '',
    purchaseRate: 0,
    sellingRate: 0,
    gstPercent: 18,
    openingStock: 0,
    reorderLevel: 0,
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({ ...product });
  };

  const handleSave = () => {
    if (editingId && editData) {
      updateProduct(editingId, editData);
      setEditingId(null);
      setEditData({});
      toast.success('Product updated successfully');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (newProduct.purchaseRate <= 0 || newProduct.sellingRate <= 0) {
      toast.error('Rates must be greater than 0');
      return;
    }
    if (products.some((p) => p.productId === newProduct.productId)) {
      toast.error('Product ID already exists');
      return;
    }

    addProduct(newProduct);
    setIsAddDialogOpen(false);
    setNewProduct({
      productId: generateProductId(products.length + 2),
      name: '',
      brand: '',
      category: '',
      purchaseRate: 0,
      sellingRate: 0,
      gstPercent: 18,
      openingStock: 0,
      reorderLevel: 0,
    });
    toast.success('Product added successfully');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Product Master"
        description="Manage your product catalog and pricing"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name, ID, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Data Grid */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Product ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Brand</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Purchase Rate</th>
                  <th className="px-4 py-3 text-right font-semibold">Selling Rate</th>
                  <th className="px-4 py-3 text-right font-semibold">GST %</th>
                  <th className="px-4 py-3 text-right font-semibold">Opening Stock</th>
                  <th className="px-4 py-3 text-right font-semibold">Reorder Level</th>
                  <th className="px-4 py-3 text-center font-semibold w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="grid-row hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-primary">
                      {product.productId}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === product.id ? (
                        <Input
                          value={editData.name || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="h-8"
                        />
                      ) : (
                        <span className="font-medium">{product.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === product.id ? (
                        <Select
                          value={editData.brand || ''}
                          onValueChange={(value) =>
                            setEditData({ ...editData, brand: value })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        product.brand
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === product.id ? (
                        <Select
                          value={editData.category || ''}
                          onValueChange={(value) =>
                            setEditData({ ...editData, category: value })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        product.category
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          value={editData.purchaseRate || 0}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              purchaseRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-8 text-right"
                        />
                      ) : (
                        formatCurrency(product.purchaseRate)
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          value={editData.sellingRate || 0}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              sellingRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-8 text-right"
                        />
                      ) : (
                        formatCurrency(product.sellingRate)
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          value={editData.gstPercent || 0}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              gstPercent: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-8 text-right w-20"
                        />
                      ) : (
                        `${product.gstPercent}%`
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          value={editData.openingStock || 0}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              openingStock: parseInt(e.target.value) || 0,
                            })
                          }
                          className="h-8 text-right w-24"
                        />
                      ) : (
                        product.openingStock
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          value={editData.reorderLevel || 0}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              reorderLevel: parseInt(e.target.value) || 0,
                            })
                          }
                          className="h-8 text-right w-24"
                        />
                      ) : (
                        product.reorderLevel
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        {editingId === product.id ? (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100"
                              onClick={handleSave}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Product ID</Label>
              <Input
                value={newProduct.productId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productId: e.target.value })
                }
                placeholder="PRD001"
              />
            </div>
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Select
                value={newProduct.brand}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, brand: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Purchase Rate (₹) *</Label>
              <Input
                type="number"
                value={newProduct.purchaseRate || ''}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    purchaseRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Selling Rate (₹) *</Label>
              <Input
                type="number"
                value={newProduct.sellingRate || ''}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    sellingRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>GST %</Label>
              <Select
                value={String(newProduct.gstPercent)}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, gstPercent: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Opening Stock</Label>
              <Input
                type="number"
                value={newProduct.openingStock || ''}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    openingStock: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Reorder Level</Label>
              <Input
                type="number"
                value={newProduct.reorderLevel || ''}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    reorderLevel: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Products;
