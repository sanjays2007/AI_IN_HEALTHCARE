'use client';

import { useState } from 'react';
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Edit,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockBudgetCategories, formatCurrency, BudgetCategory } from '@/lib/finance-data';

export default function FinanceBudgetPage() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);

  // Calculate totals
  const totalBudget = mockBudgetCategories.reduce((sum, b) => sum + b.allocated, 0);
  const totalUtilized = mockBudgetCategories.reduce((sum, b) => sum + b.utilized, 0);
  const totalPending = mockBudgetCategories.reduce((sum, b) => sum + b.pending, 0);
  const totalRemaining = totalBudget - totalUtilized - totalPending;
  const utilizationPercent = (totalUtilized / totalBudget) * 100;

  const getUtilizationStatus = (utilized: number, allocated: number) => {
    const percent = (utilized / allocated) * 100;
    if (percent >= 90) return { label: 'Critical', color: 'text-red-600 bg-red-100' };
    if (percent >= 75) return { label: 'High', color: 'text-orange-600 bg-orange-100' };
    if (percent >= 50) return { label: 'Moderate', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Normal', color: 'text-green-600 bg-green-100' };
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setSelectedCategory(category);
    setShowEditDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-muted-foreground">Track and manage financial aid budget allocation</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Total Budget</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(totalBudget)}
                </p>
                <p className="text-xs text-emerald-600">FY 2025-26</p>
              </div>
              <PiggyBank className="h-10 w-10 text-emerald-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Utilized</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(totalUtilized)}
                </p>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {utilizationPercent.toFixed(1)}% of budget
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {formatCurrency(totalPending)}
                </p>
                <p className="text-xs text-yellow-600">Awaiting disbursement</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-700">
                  {formatCurrency(totalRemaining)}
                </p>
                <p className="text-xs text-gray-600">Available for allocation</p>
              </div>
              <DollarSign className="h-10 w-10 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Utilization</CardTitle>
          <CardDescription>Current fiscal year spending progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${(totalUtilized / totalBudget) * 100}%` }}
              />
              <div
                className="bg-yellow-400 h-full transition-all"
                style={{ width: `${(totalPending / totalBudget) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Utilized ({((totalUtilized / totalBudget) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-400" />
                  <span>Pending ({((totalPending / totalBudget) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-200" />
                  <span>Available ({((totalRemaining / totalBudget) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockBudgetCategories.map((category) => {
          const utilizedPercent = (category.utilized / category.allocated) * 100;
          const pendingPercent = (category.pending / category.allocated) * 100;
          const remaining = category.allocated - category.utilized - category.pending;
          const status = getUtilizationStatus(category.utilized, category.allocated);

          return (
            <Card key={category.category} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{formatCurrency(category.allocated)}</span>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${utilizedPercent}%` }}
                    />
                    <div
                      className="bg-yellow-400 h-full"
                      style={{ width: `${pendingPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="p-2 bg-emerald-50 rounded">
                    <p className="text-emerald-600 font-semibold">
                      {formatCurrency(category.utilized)}
                    </p>
                    <p className="text-xs text-muted-foreground">Utilized</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="text-yellow-600 font-semibold">
                      {formatCurrency(category.pending)}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600 font-semibold">{formatCurrency(remaining)}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{utilizedPercent.toFixed(0)}% utilized</span>
                  <span>{(100 - utilizedPercent - pendingPercent).toFixed(0)}% available</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Budget Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Budget Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBudgetCategories
              .filter((b) => (b.utilized / b.allocated) * 100 >= 60)
              .map((category) => {
                const percent = (category.utilized / category.allocated) * 100;
                return (
                  <div
                    key={category.category}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      percent >= 90
                        ? 'bg-red-50 border border-red-200'
                        : percent >= 75
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {percent >= 90 ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : percent >= 75 ? (
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {percent.toFixed(0)}% of budget utilized
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                );
              })}
            {mockBudgetCategories.filter((b) => (b.utilized / b.allocated) * 100 >= 60)
              .length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No budget alerts at this time
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Category</DialogTitle>
            <DialogDescription>
              Modify budget allocation for {selectedCategory?.category}
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input defaultValue={selectedCategory.category} />
              </div>
              <div className="space-y-2">
                <Label>Allocated Budget (₹)</Label>
                <Input type="number" defaultValue={selectedCategory.allocated} />
              </div>
              <div className="p-3 bg-gray-50 rounded space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Currently Utilized</span>
                  <span className="font-medium">
                    {formatCurrency(selectedCategory.utilized)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Disbursement</span>
                  <span className="font-medium">{formatCurrency(selectedCategory.pending)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowEditDialog(false)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
