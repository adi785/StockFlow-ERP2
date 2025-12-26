import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface BudgetItem {
  ledgerId: string;
  ledgerName: string;
  group: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
}

interface BudgetAnalysisProps {
  budgetName: string;
  budgetItems: BudgetItem[];
}

export const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ budgetName, budgetItems }) => {
  const totalBudgeted = budgetItems.reduce((sum, item) => sum + item.budgetedAmount, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
  const totalVariance = totalActual - totalBudgeted;

  const chartData = budgetItems.map(item => ({
    name: item.ledgerName,
    Budgeted: item.budgetedAmount,
    Actual: item.actualAmount,
    Variance: item.variance,
  }));

  const varianceData = [
    { name: 'Under Budget', value: Math.abs(Math.min(0, totalVariance)) },
    { name: 'Over Budget', value: Math.max(0, totalVariance) },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Budget Analysis
        </CardTitle>
        <CardDescription>{budgetName}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Budgeted</div>
                <div className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Actual</div>
                <div className="text-2xl font-bold">{formatCurrency(totalActual)}</div>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-yellow-50/50 dark:bg-yellow-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Variance</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(Math.abs(totalVariance))}
                </div>
              </div>
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/50">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              {totalVariance >= 0 ? 'Over Budget' : 'Under Budget'}
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-purple-50/50 dark:bg-purple-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Variance %</div>
                <div className="text-2xl font-bold">
                  {totalBudgeted > 0 ? `${((totalVariance / totalBudgeted) * 100).toFixed(2)}%` : '0.00%'}
                </div>
              </div>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/50">
                <TrendingDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Budget vs Actual Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual</CardTitle>
              <CardDescription>Comparison by ledger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="Budgeted" fill="#3B82F6" name="Budgeted" />
                    <Bar dataKey="Actual" fill="#10B981" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Variance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Variance Distribution</CardTitle>
              <CardDescription>Over vs Under budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={varianceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {varianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>Item-wise budget performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Ledger</th>
                      <th className="px-4 py-3 text-left font-semibold">Group</th>
                      <th className="px-4 py-3 text-right font-semibold">Budgeted</th>
                      <th className="px-4 py-3 text-right font-semibold">Actual</th>
                      <th className="px-4 py-3 text-right font-semibold">Variance</th>
                      <th className="px-4 py-3 text-right font-semibold">Variance %</th>
                      <th className="px-4 py-3 text-center font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {budgetItems.map((item) => (
                      <tr key={item.ledgerId} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{item.ledgerName}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{item.group}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {formatCurrency(item.budgetedAmount)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {formatCurrency(item.actualAmount)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                          <span className={item.variance >= 0 ? 'text-red-600' : 'text-green-600'}>
                            {item.variance >= 0 ? '+' : '-'} {formatCurrency(Math.abs(item.variance))}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {item.budgetedAmount > 0 ? `${item.variancePercentage.toFixed(2)}%` : '0.00%'}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.variance >= 0
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {item.variance >= 0 ? 'Over Budget' : 'Under Budget'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td colSpan={2} className="px-4 py-3 text-right font-semibold">Totals:</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">
                        {formatCurrency(totalBudgeted)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">
                        {formatCurrency(totalActual)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold">
                        <span className={totalVariance >= 0 ? 'text-red-600' : 'text-green-600'}>
                          {totalVariance >= 0 ? '+' : '-'} {formatCurrency(Math.abs(totalVariance))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">
                        {totalBudgeted > 0 ? `${((totalVariance / totalBudgeted) * 100).toFixed(2)}%` : '0.00%'}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};