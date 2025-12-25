import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useERPStore } from '@/store/erpStore';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Supplier } from '@/integrations/supabase/partnerApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Suppliers = () => {
  const suppliers = useERPStore((state) => state.suppliers);
  const addSupplier = useERPStore((state) => state.addSupplier);
  const updateSupplier = useERPStore((state) => state.updateSupplier);
  const deleteSupplier = useERPStore((state) => state.deleteSupplier);
  const fetchSuppliers = useERPStore((state) => state.fetchSuppliers);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Supplier>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstin: '',
    openingBalance: 0,
  });

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.phone && s.phone.includes(searchTerm))
  );

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditData({ ...supplier });
  };

  const handleSave = () => {
    if (editingId && editData) {
      updateSupplier(editingId, editData);
      setEditingId(null);
      setEditData({});
      toast.success('Supplier updated successfully');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteSupplier(id);
      toast.success('Supplier deleted successfully');
    }
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name) {
      toast.error('Please enter supplier name');
      return;
    }

    addSupplier(newSupplier);
    setIsAddDialogOpen(false);
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstin: '',
      openingBalance: 0,
    });
    toast.success('Supplier added successfully');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Suppliers"
        description="Manage your suppliers (those you buy from)"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        }
      />
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search suppliers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </div>

        {/* Data Grid */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Contact Person</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">City</th>
                  <th className="px-4 py-3 text-left font-semibold">GSTIN</th>
                  <th className="px-4 py-3 text-right font-semibold">Opening Balance</th>
                  <th className="px-4 py-3 text-center font-semibold w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5">
                      {editingId === supplier.id ? (
                        <Input
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="font-medium">{supplier.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === supplier.id ? (
                        <Input
                          value={editData.contactPerson || ''}
                          onChange={(e) => setEditData({ ...editData, contactPerson: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        supplier.contactPerson
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === supplier.id ? (
                        <Input
                          value={editData.email || ''}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        supplier.email
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === supplier.id ? (
                        <Input
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        supplier.phone
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === supplier.id ? (
                        <Input
                          value={editData.city || ''}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        supplier.city
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === supplier.id ? (
                        <Input
                          value={editData.gstin || ''}
                          onChange={(e) => setEditData({ ...editData, gstin: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        supplier.gstin
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {editingId === supplier.id ? (
                        <Input
                          type="number"
                          value={editData.openingBalance || 0}
                          onChange={(e) =>
                            setEditData({ ...editData, openingBalance: parseFloat(e.target.value) || 0 })
                          }
                          className="h-8 text-right"
                        />
                      ) : (
                        supplier.openingBalance
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        {editingId === supplier.id ? (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100"
                              onClick={handleSave}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(supplier)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(supplier.id, supplier.name)}
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

      {/* Add Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Supplier Name *</Label>
                <Input
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input
                  value={newSupplier.contactPerson || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                  placeholder="Enter contact person"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newSupplier.email || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newSupplier.phone || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input
                  value={newSupplier.address || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={newSupplier.city || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={newSupplier.state || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={newSupplier.pincode || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={newSupplier.gstin || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, gstin: e.target.value })}
                  placeholder="Enter GSTIN"
                />
              </div>
              <div className="space-y-2">
                <Label>Opening Balance</Label>
                <Input
                  type="number"
                  value={newSupplier.openingBalance || 0}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, openingBalance: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Suppliers;