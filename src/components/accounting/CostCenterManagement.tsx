import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Users, DollarSign, Calendar } from 'lucide-react';

interface CostCenter {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

interface CostCategory {
  id: string;
  name: string;
  costCenterId: string;
  createdAt: Date;
}

interface CostTracking {
  id: string;
  date: Date;
  costCenterId: string;
  costCategoryId: string;
  amount: number;
  description: string;
  reference: string;
  createdAt: Date;
}

interface CostCenterManagementProps {
  costCenters: CostCenter[];
  costCategories: CostCategory[];
  costTracking: CostTracking[];
  onAddCostCenter: (center: { name: string; description: string }) => void;
  onAddCostCategory: (category: { name: string; costCenterId: string }) => void;
  onAddCostTracking: (tracking: {
    date: Date;
    costCenterId: string;
    costCategoryId: string;
    amount: number;
    description: string;
    reference: string;
  }) => void;
}

export const CostCenterManagement: React.FC<CostCenterManagementProps> = ({
  costCenters,
  costCategories,
  costTracking,
  onAddCostCenter,
  onAddCostCategory,
  onAddCostTracking,
}) => {
  const [newCostCenter, setNewCostCenter] = React.useState({
    name: '',
    description: '',
  });

  const [newCostCategory, setNewCostCategory] = React.useState({
    name: '',
    costCenterId: '',
  });

  const [newCostTracking, setNewCostTracking] = React.useState({
    date: new Date().toISOString().split('T')[0],
    costCenterId: '',
    costCategoryId: '',
    amount: 0,
    description: '',
    reference: '',
  });

  const handleAddCostCenter = () => {
    if (!newCostCenter.name) {
      toast.error('Please enter cost center name');
      return;
    }
    onAddCostCenter(newCostCenter);
    setNewCostCenter({ name: '', description: '' });
  };

  const handleAddCostCategory = () => {
    if (!newCostCategory.name || !newCostCategory.costCenterId) {
      toast.error('Please select cost center and enter category name');
      return;
    }
    onAddCostCategory(newCostCategory);
    setNewCostCategory({ name: '', costCenterId: '' });
  };

  const handleAddCostTracking = () => {
    if (!newCostTracking.costCenterId || !newCostTracking.costCategoryId || newCostTracking.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    onAddCostTracking({
      ...newCostTracking,
      date: new Date(newCostTracking.date),
    });
    setNewCostTracking({
      date: new Date().toISOString().split('T')[0],
      costCenterId: '',
      costCategoryId: '',
      amount: 0,
      description: '',
      reference: '',
    });
  };

  const getCostCenterName = (id: string) => {
    const center = costCenters.find(c => c.id === id);
    return center ? center.name : 'Unknown';
  };

  const getCostCategoryName = (id: string) => {
    const category = costCategories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  };

  const costCenterTotals = costCenters.map(center => {
    const total = costTracking
      .filter(t => t.costCenterId === center.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...center, total };
  });

  const categoryTotals = costCategories.map(category => {
    const total = costTracking
      .filter(t => t.costCategoryId === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...category, total };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Cost Center Management
        </CardTitle>
        <CardDescription>Track and manage costs by department and category</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add Cost Center */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Cost Center</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Cost Center Name</Label>
                <Input
                  value={newCostCenter.name}
                  onChange={(e) => setNewCostCenter({ ...newCostCenter, name: e.target.value })}
                  placeholder="Enter cost center name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newCostCenter.description}
                  onChange={(e) => setNewCostCenter({ ...newCostCenter, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <Button onClick={handleAddCostCenter} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Cost Center
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Cost Category */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Cost Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Cost Center</Label>
                <select
                  value={newCostCategory.costCenterId}
                  onChange={(e) => setNewCostCategory({ ...newCostCategory, costCenterId: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Cost Center</option>
                  {costCenters.map(center => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={newCostCategory.name}
                  onChange={(e) => setNewCostCategory({ ...newCostCategory, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <Button onClick={handleAddCostCategory} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Cost Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Record Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newCostTracking.date}
                  onChange={(e) => setNewCostTracking({ ...newCostTracking, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cost Center</Label>
                <select
                  value={newCostTracking.costCenterId}
                  onChange={(e) => setNewCostTracking({ ...newCostTracking, costCenterId: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Cost Center</option>
                  {costCenters.map(center => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Cost Category</Label>
                <select
                  value={newCostTracking.costCategoryId}
                  onChange={(e) => setNewCostTracking({ ...newCostTracking, costCategoryId: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {costCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={newCostTracking.amount}
                  onChange={(e) => setNewCostTracking({ ...newCostTracking, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label>Reference</Label>
                <Input
                  value={newCostTracking.reference}
                  onChange={(e) => setNewCostTracking({ ...newCostTracking, reference: e.target.value })}
                  placeholder="Invoice/Ref No"
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <Button onClick={handleAddCostTracking} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Record Cost
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Center Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cost Center Summary</CardTitle>
            <CardDescription>Total costs by cost center</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Cost Center</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Cost</th>
                      <th className="px-4 py-3 text-right font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {costCenterTotals.map((center) => (
                      <tr key={center.id} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{center.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{center.description}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-red-600">
                          {center.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">
                          {center.createdAt.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total:</td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold text-red-600">
                        {costCenterTotals.reduce((sum, c) => sum + c.total, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Tracking History */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Tracking History</CardTitle>
            <CardDescription>Recent cost entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Date</th>
                      <th className="px-4 py-3 text-left font-semibold">Cost Center</th>
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-right font-semibold">Amount</th>
                      <th className="px-4 py-3 text-center font-semibold">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {costTracking.map((tracking) => (
                      <tr key={tracking.id} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 text-muted-foreground">
                          <Calendar className="inline mr-1 h-4 w-4" />
                          {tracking.date.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2.5">{getCostCenterName(tracking.costCenterId)}</td>
                        <td className="px-4 py-2.5">{getCostCategoryName(tracking.costCategoryId)}</td>
                        <td className="px-4 py-2.5">{tracking.description}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-red-600">
                          {tracking.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </td>
                        <td className="px-4 py-2.5 text-center font-mono text-xs text-muted-foreground">
                          {tracking.reference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};