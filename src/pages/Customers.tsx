import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useERPStore } from '@/store/erpStore';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Customer } from '@/integrations/supabase/partnerApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Customers = () => {
  const customers = useERPStore((state) => state.customers);
  const addCustomer = useERPStore((state) => state.addCustomer);
  const updateCustomer = useERPStore((state) => state.updateCustomer);
  const deleteCustomer = useERPStore((state) => state.deleteCustomer);
  const fetchCustomers = useERPStore((state) => state.fetchCustomers);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Customer>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>({
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

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone && c.phone.includes(searchTerm))
  );

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditData({ ...customer });
  };

  const handleSave = () => {
    if (editingId && editData) {
      updateCustomer(editingId, editData);
      setEditingId(null);
      setEditData({});
      toast.success('Customer updated successfully');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteCustomer(id);
      toast.success('Customer deleted successfully');
    }
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name) {
      toast.error('Please enter customer name');
      return;
    }

    addCustomer(newCustomer);
    setIsAddDialogOpen(false);
    setNewCustomer({
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
    toast.success('Customer added successfully');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Customers"
        description="Manage your customers (those you sell to)"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        }
      />
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredCustomers.length} of {customers.length} customers
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5">
                      {editingId === customer.id ? (
                        <Input
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="font-medium">{customer.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === customer.id ? (
                        <Input
                          value={editData.contactPerson || ''}
                          onChange={(e) => setEditData({ ...editData, contactPerson: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        customer.contactPerson
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === customer.id ? (
                        <Input
                          value={editData.email || ''}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        customer.email
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === customer.id ? (
                        <Input
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        customer.phone
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === customer.id ? (
                        <Input
                          value={editData.city || ''}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        customer.city
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === customer.id ? (
                        <Input
                          value={editData.gstin || ''}
                          onChange={(e) => setEditData({ ...editData, gstin: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        customer.gstin
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {editingId === customer.id ? (
                        <Input
                          type="number"
                          value={editData.openingBalance || 0}
                          onChange={(e) =>
                            setEditData({ ...editData, openingBalance: parseFloat(e.target.value) || 0 })
                          }
                          className="h-8 text-right"
                        />
                      ) : (
                        customer.openingBalance
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        {editingId === customer.id ? (
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
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(customer)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(customer.id, customer.name)}
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

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Input
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input
                  value={newCustomer.contactPerson || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contactPerson: e.target.value })}
                  placeholder="Enter contact person"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCustomer.email || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newCustomer.phone || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input
                  value={newCustomer.address || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={newCustomer.city || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={newCustomer.state || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={newCustomer.pincode || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={newCustomer.gstin || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, gstin: e.target.value })}
                  placeholder="Enter GSTIN"
                />
              </div>
              <div className="space-y-2">
                <Label>Opening Balance</Label>
                <Input
                  type="number"
                  value={newCustomer.openingBalance || 0}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, openingBalance: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Customers;