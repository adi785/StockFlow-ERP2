import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calculator, TrendingUp, TrendingDown, Scale, DollarSign } from 'lucide-react';

interface RatioAnalysisProps {
  liquidityRatios: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
  };
  profitabilityRatios: {
    grossProfitMargin: number;
    netProfitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
  };
  efficiencyRatios: {
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
  };
  solvencyRatios: {
    debtToEquity: number;
    interestCoverage: number;
    debtToAssets: number;
  };
}

export const RatioAnalysis: React.FC<RatioAnalysisProps> = ({
  liquidityRatios,
  profitabilityRatios,
  efficiencyRatios,
  solvencyRatios,
}) => {
  const liquidityData = [
    { name: 'Current Ratio', value: liquidityRatios.currentRatio },
    { name: 'Quick Ratio', value: liquidityRatios.quickRatio },
    { name: 'Cash Ratio', value: liquidityRatios.cashRatio },
  ];

  const profitabilityData = [
    { name: 'Gross Profit Margin', value: profitabilityRatios.grossProfitMargin },
    { name: 'Net Profit Margin', value: profitabilityRatios.netProfitMargin },
    { name: 'Return on Assets', value: profitabilityRatios.returnOnAssets },
    { name: 'Return on Equity', value: profitabilityRatios.returnOnEquity },
  ];

  const efficiencyData = [
    { name: 'Inventory Turnover', value: efficiencyRatios.inventoryTurnover },
    { name: 'Receivables Turnover', value: efficiencyRatios.receivablesTurnover },
    { name: 'Payables Turnover', value: efficiencyRatios.payablesTurnover },
  ];

  const solvencyData = [
    { name: 'Debt to Equity', value: solvencyRatios.debtToEquity },
    { name: 'Interest Coverage', value: solvencyRatios.interestCoverage },
    { name: 'Debt to Assets', value: solvencyRatios.debtToAssets },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

  const getRatioStatus = (ratio: number, type: string) => {
    switch (type) {
      case 'liquidity':
        return ratio >= 1 ? 'Good' : ratio >= 0.5 ? 'Warning' : 'Poor';
      case 'profitability':
        return ratio >= 0.1 ? 'Good' : ratio >= 0 ? 'Warning' : 'Poor';
      case 'efficiency':
        return ratio >= 2 ? 'Good' : ratio >= 1 ? 'Warning' : 'Poor';
      case 'solvency':
        return ratio <= 1 ? 'Good' : ratio <= 2 ? 'Warning' : 'Poor';
      default:
        return 'Unknown';
    }
  };

  const getRatioColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Poor': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Ratio Analysis
        </CardTitle>
        <CardDescription>Financial health indicators</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Liquidity Ratios */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              Liquidity Ratios
            </CardTitle>
            <CardDescription>Ability to meet short-term obligations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Current Ratio</div>
                    <div className="text-2xl font-bold">{liquidityRatios.currentRatio.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(liquidityRatios.currentRatio, 'liquidity'))}`}>
                    {getRatioStatus(liquidityRatios.currentRatio, 'liquidity')}
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Ideal: >1.0</div>
              </div>
              
              <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Quick Ratio</div>
                    <div className="text-2xl font-bold">{liquidityRatios.quickRatio.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(liquidityRatios.quickRatio, 'liquidity'))}`}>
                    {getRatioStatus(liquidityRatios.quickRatio, 'liquidity')}
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Ideal: >1.0</div>
              </div>
              
              <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Cash Ratio</div>
                    <div className="text-2xl font-bold">{liquidityRatios.cashRatio.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(liquidityRatios.cashRatio, 'liquidity'))}`}>
                    {getRatioStatus(liquidityRatios.cashRatio, 'liquidity')}
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Ideal: >0.5</div>
              </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liquidityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => (value as number).toFixed(2)} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Profitability Ratios */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Profitability Ratios
            </CardTitle>
            <CardDescription>Ability to generate profits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-600 dark:text-green-400">Gross Profit Margin</div>
                    <div className="text-2xl font-bold">{(profitabilityRatios.grossProfitMargin * 100).toFixed(2)}%</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(profitabilityRatios.grossProfitMargin, 'profitability'))}`}>
                    {getRatioStatus(profitabilityRatios.grossProfitMargin, 'profitability')}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-600 dark:text-green-400">Net Profit Margin</div>
                    <div className="text-2xl font-bold">{(profitabilityRatios.netProfitMargin * 100).toFixed(2)}%</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(profitabilityRatios.netProfitMargin, 'profitability'))}`}>
                    {getRatioStatus(profitabilityRatios.netProfitMargin, 'profitability')}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-600 dark:text-green-400">Return on Assets</div>
                    <div className="text-2xl font-bold">{(profitabilityRatios.returnOnAssets * 100).toFixed(2)}%</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(profitabilityRatios.returnOnAssets, 'profitability'))}`}>
                    {getRatioStatus(profitabilityRatios.returnOnAssets, 'profitability')}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-600 dark:text-green-400">Return on Equity</div>
                    <div className="text-2xl font-bold">{(profitabilityRatios.returnOnEquity * 100).toFixed(2)}%</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(profitabilityRatios.returnOnEquity, 'profitability'))}`}>
                    {getRatioStatus(profitabilityRatios.returnOnEquity, 'profitability')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitabilityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(value) => `${(value as number * 100).toFixed(2)}%`} />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Ratios */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Efficiency Ratios
            </CardTitle>
            <CardDescription>How efficiently the company uses its assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-lg border border-border bg-purple-50/50 dark:bg-purple-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Inventory Turnover</div>
                    <div className="text-2xl font-bold">{efficiencyRatios.inventoryTurnover.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(efficiencyRatios.inventoryTurnover, 'efficiency'))}`}>
                    {getRatioStatus(efficiencyRatios.inventoryTurnover, 'efficiency')}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-purple-50/50 dark:bg-purple-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Receivables Turnover</div>
                    <div className="text-2xl font-bold">{efficiencyRatios.receivablesTurnover.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(efficiencyRatios.receivablesTurnover, 'efficiency'))}`}>
                    {getRatioStatus(efficiencyRatios.receivablesTurnover, 'efficiency')}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-purple-50/50 dark:bg-purple-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Payables Turnover</div>
                    <div className="text-2xl font-bold">{efficiencyRatios.payablesTurnover.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(efficiencyRatios.payablesTurnover, 'efficiency'))}`}>
                    {getRatioStatus(efficiencyRatios.payablesTurnover, 'efficiency')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => (value as number).toFixed(2)} />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Solvency Ratios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Solvency Ratios
            </CardTitle>
            <CardDescription>Long-term financial stability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-red-600 dark:text-red-400">Debt to Equity</div>
                    <div className="text-2xl font-bold">{solvencyRatios.debtToEquity.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(solvencyRatios.debtToEquity, 'solvency'))}`}>
                    {getRatioStatus(solvencyRatios.debtToEquity, 'solvency')}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-red-600 dark:text-red-400">Interest Coverage</div>
                    <div className="text-2xl font-bold">{solvencyRatios.interestCoverage.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(solvencyRatios.interestCoverage, 'solvency'))}`}>
                    {getRatioStatus(solvencyRatios.interestCoverage, 'solvency')}
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-red-600 dark:text-red-400">Debt to Assets</div>
                    <div className="text-2xl font-bold">{solvencyRatios.debtToAssets.toFixed(2)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatioColor(getRatioStatus(solvencyRatios.debtToAssets, 'solvency'))}`}>
                    {getRatioStatus(solvencyRatios.debtToAssets, 'solvency')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={solvencyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => (value as number).toFixed(2)} />
                  <Bar dataKey="value" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};