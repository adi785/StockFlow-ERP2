import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Globe } from 'lucide-react';

interface MultiCurrencyProps {
  currencies: Array<{
    currencyCode: string;
    currencyName: string;
    exchangeRate: number;
    lastUpdated: Date;
  }>;
  onAddCurrency: (currency: {
    currencyCode: string;
    currencyName: string;
    exchangeRate: number;
  }) => void;
  onUpdateRate: (currencyCode: string, rate: number) => void;
}

export const MultiCurrency: React.FC<MultiCurrencyProps> = ({
  currencies,
  onAddCurrency,
  onUpdateRate,
}) => {
  const [newCurrency, setNewCurrency] = React.useState({
    currencyCode: '',
    currencyName: '',
    exchangeRate: 1,
  });

  const [editingRates, setEditingRates] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const initialRates: Record<string, number> = {};
    currencies.forEach(currency => {
      initialRates[currency.currencyCode] = currency.exchangeRate;
    });
    setEditingRates(initialRates);
  }, [currencies]);

  const handleAddCurrency = () => {
    if (!newCurrency.currencyCode || !newCurrency.currencyName) {
      toast.error('Please enter currency code and name');
      return;
    }
    onAddCurrency(newCurrency);
    setNewCurrency({ currencyCode: '', currencyName: '', exchangeRate: 1 });
  };

  const handleUpdateRate = (currencyCode: string) => {
    const newRate = editingRates[currencyCode];
    if (newRate <= 0) {
      toast.error('Exchange rate must be greater than 0');
      return;
    }
    onUpdateRate(currencyCode, newRate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Multi-Currency Management
        </CardTitle>
        <CardDescription>Manage foreign currencies and exchange rates</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add New Currency */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Currency Code</Label>
                <Input
                  value={newCurrency.currencyCode}
                  onChange={(e) => setNewCurrency({ ...newCurrency, currencyCode: e.target.value.toUpperCase() })}
                  placeholder="USD, EUR, GBP"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency Name</Label>
                <Input
                  value={newCurrency.currencyName}
                  onChange={(e) => setNewCurrency({ ...newCurrency, currencyName: e.target.value })}
                  placeholder="US Dollar, Euro, British Pound"
                />
              </div>
              <div className="space-y-2">
                <Label>Exchange Rate</Label>
                <Input
                  type="number"
                  value={newCurrency.exchangeRate}
                  onChange={(e) => setNewCurrency({ ...newCurrency, exchangeRate: parseFloat(e.target.value) || 0 })}
                  placeholder="1.00"
                  step="0.0001"
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <Button onClick={handleAddCurrency} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Currency
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency List */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Currency</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-right font-semibold">Exchange Rate</th>
                  <th className="px-4 py-3 text-right font-semibold">Last Updated</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currencies.map((currency) => (
                  <tr key={currency.currencyCode} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-semibold text-primary">
                      {currency.currencyCode}
                    </td>
                    <td className="px-4 py-2.5">{currency.currencyName}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editingRates[currency.currencyCode] || currency.exchangeRate}
                          onChange={(e) => setEditingRates({
                            ...editingRates,
                            [currency.currencyCode]: parseFloat(e.target.value) || 0
                          })}
                          className="w-32"
                          step="0.0001"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateRate(currency.currencyCode)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {currency.lastUpdated.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Currency Conversion Helper */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Currency Conversion Helper</CardTitle>
            <CardDescription>Quick conversion calculator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Base Amount (INR)</label>
                <Input type="number" placeholder="1000" />
              </div>
              <div className="space-y-2">
                <Label>From Currency</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>INR - Indian Rupee</option>
                  {currencies.map(c => (
                    <option key={c.currencyCode} value={c.currencyCode}>
                      {c.currencyCode} - {c.currencyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>To Currency</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  {currencies.map(c => (
                    <option key={c.currencyCode} value={c.currencyCode}>
                      {c.currencyCode} - {c.currencyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Converted Amount</label>
                <Input type="text" value="0.00" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};