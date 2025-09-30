import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  Calculator, 
  Plus, 
  Edit,
  Trash2,
  Fuel,
  IndianRupee,
  Gauge 
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import UnifiedRecords from './UnifiedRecords';

const SalesTracker = ({ 
  isDarkMode, 
  salesData, 
  setSalesData, 
  fuelSettings, 
  selectedDate, 
  creditData, 
  setCreditData, 
  incomeData, 
  setIncomeData, 
  expenseData, 
  setExpenseData 
}) => {
  const [formData, setFormData] = useState({
    nozzle: '',
    fuelType: '',
    startReading: '',
    endReading: '',
    rate: '',
    type: 'cash'
  });
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  // Generate fuel types from settings
  const fuelTypes = Object.entries(fuelSettings).map(([type, config]) => ({
    type,
    rate: config.price
  }));

  // Generate nozzles for a specific fuel type
  const generateNozzlesForFuelType = (fuelType) => {
    if (!fuelSettings[fuelType]) return [];
    
    const config = fuelSettings[fuelType];
    const nozzles = [];
    
    // Special naming for specific fuel types
    let prefix;
    if (fuelType.toLowerCase() === 'power') {
      prefix = 'PO';
    } else if (fuelType.toLowerCase() === 'premium') {
      prefix = 'PR';
    } else {
      prefix = fuelType.charAt(0).toUpperCase();
    }
    
    for (let i = 1; i <= config.nozzleCount; i++) {
      const nozzleId = `${prefix}${i}`;
      nozzles.push({
        id: nozzleId,
        name: `Nozzle ${nozzleId}`,
        currentReading: Math.floor(Math.random() * 2000) + 500 // Mock reading
      });
    }
    return nozzles;
  };

  const generateNozzles = () => {
    const allNozzles = [];
    Object.entries(fuelSettings).forEach(([fuelType, config]) => {
      // Special naming for specific fuel types
      let prefix;
      if (fuelType.toLowerCase() === 'power') {
        prefix = 'PO';
      } else if (fuelType.toLowerCase() === 'premium') {
        prefix = 'PR';
      } else {
        prefix = fuelType.charAt(0).toUpperCase();
      }
      
      for (let i = 1; i <= config.nozzleCount; i++) {
        allNozzles.push(`${prefix}${i}`);
      }
    });
    return allNozzles;
  };

  const nozzles = generateNozzles();

  const handleFuelChange = (fuelType) => {
    const fuelConfig = fuelSettings[fuelType];
    setFormData(prev => ({
      ...prev,
      fuelType,
      nozzle: '', // Clear nozzle selection when fuel type changes
      rate: fuelConfig ? fuelConfig.price.toString() : ''
    }));
  };

  const calculateSale = () => {
    const { startReading, endReading, rate } = formData;
    if (!startReading || !endReading || !rate) return null;
    
    const liters = parseFloat(endReading) - parseFloat(startReading);
    const amount = liters * parseFloat(rate);
    
    return { liters: liters.toFixed(2), amount: amount.toFixed(2) };
  };

  const handleSubmit = () => {
    if (!formData.nozzle || !formData.fuelType || !formData.startReading || !formData.endReading || !formData.rate) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const calculation = calculateSale();
    if (!calculation || calculation.liters <= 0) {
      toast({
        title: "Invalid Reading",
        description: "End reading must be greater than start reading",
        variant: "destructive",
      });
      return;
    }

    const saleRecord = {
      id: editingId || Date.now(),
      date: selectedDate,
      ...formData,
      startReading: parseFloat(formData.startReading),
      endReading: parseFloat(formData.endReading),
      rate: parseFloat(formData.rate),
      liters: parseFloat(calculation.liters),
      amount: parseFloat(calculation.amount)
    };

    if (editingId) {
      setSalesData(prev => prev.map(sale => sale.id === editingId ? saleRecord : sale));
      setEditingId(null);
      toast({ title: "Sale Updated", description: "Sale record updated successfully" });
    } else {
      setSalesData(prev => [saleRecord, ...prev]);
      toast({ title: "Sale Added", description: "Sale record added successfully" });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nozzle: '',
      fuelType: '',
      startReading: '',
      endReading: '',
      rate: '',
      type: 'cash'
    });
    setEditingId(null);
  };

  const editSale = (sale) => {
    setFormData({
      nozzle: sale.nozzle,
      fuelType: sale.fuelType,
      startReading: sale.startReading.toString(),
      endReading: sale.endReading.toString(),
      rate: sale.rate.toString(),
      type: sale.type
    });
    setEditingId(sale.id);
  };

  const deleteSale = (id) => {
    setSalesData(prev => prev.filter(sale => sale.id !== id));
    toast({ title: "Sale Deleted", description: "Sale record deleted successfully" });
  };

  const calculation = calculateSale();

  // Filter sales data for the selected date
  const filteredSalesData = salesData.filter(sale => sale.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {editingId ? 'Edit Sale Record' : 'Add Sale Record'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={handleFuelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fuelSettings).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      {type} - ₹{config.price}/L
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Nozzle</Label>
              <Select 
                value={formData.nozzle} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, nozzle: value }))}
                disabled={!formData.fuelType}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.fuelType ? "Select nozzle" : "Select fuel type first"} />
                </SelectTrigger>
                <SelectContent>
                  {formData.fuelType && generateNozzlesForFuelType(formData.fuelType).map((nozzle) => (
                    <SelectItem key={nozzle.id} value={nozzle.id}>
                      {nozzle.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Reading</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.startReading}
                onChange={(e) => setFormData(prev => ({ ...prev, startReading: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">End Reading</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.endReading}
                onChange={(e) => setFormData(prev => ({ ...prev, endReading: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Rate per Liter (₹)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.rate}
              onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          {calculation && (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${
              isDarkMode ? 'bg-green-900/20 border-green-700' : ''
            }`}>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-green-600">Liters</p>
                  <p className="text-xl font-bold text-green-700">{calculation.liters}L</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Amount</p>
                  <p className="text-xl font-bold text-green-700">₹{calculation.amount}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update Sale' : 'Add Sale'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <Card className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      } shadow-lg`}>
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Fuel className="w-5 h-5" />
            Sales Records ({filteredSalesData.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-3">
              {filteredSalesData.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No sales records for {selectedDate === new Date().toISOString().split('T')[0] ? 'today' : 'selected date'}</p>
                </div>
              ) : (
                filteredSalesData.map((sale) => (
                  <div key={sale.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 border-0">
                          {sale.nozzle}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 border-0">
                          {sale.fuelType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editSale(sale)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteSale(sale.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Reading:</span>
                        <span className="font-medium">{sale.startReading}L → {sale.endReading}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Liters:</span>
                        <span className="font-medium">{sale.liters}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Rate:</span>
                        <span className="font-medium">₹{sale.rate}/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date:</span>
                        <span className="font-medium">{sale.date}</span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Total Amount:</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="text-xl font-bold text-green-600">
                          {sale.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      </div>
      
      {/* Unified Records View */}
      <UnifiedRecords
        isDarkMode={isDarkMode}
        salesData={salesData}
        creditData={creditData}
        incomeData={incomeData}
        expenseData={expenseData}
        selectedDate={selectedDate}
        onEditSale={editSale}
        onDeleteSale={deleteSale}
        onEditCredit={(credit) => {
          // Handle credit edit - could navigate to credit tab
          toast({ title: "Edit Credit", description: "Please use the Credit Sales tab to edit this record" });
        }}
        onDeleteCredit={(id) => {
          setCreditData(prev => prev.filter(credit => credit.id !== id));
          toast({ title: "Credit Deleted", description: "Credit sale deleted successfully" });
        }}
        onEditIncome={(income) => {
          toast({ title: "Edit Income", description: "Please use the Income/Expenses tab to edit this record" });
        }}
        onDeleteIncome={(id) => {
          setIncomeData(prev => prev.filter(income => income.id !== id));
          toast({ title: "Income Deleted", description: "Income record deleted successfully" });
        }}
        onEditExpense={(expense) => {
          toast({ title: "Edit Expense", description: "Please use the Income/Expenses tab to edit this record" });
        }}
        onDeleteExpense={(id) => {
          setExpenseData(prev => prev.filter(expense => expense.id !== id));
          toast({ title: "Expense Deleted", description: "Expense record deleted successfully" });
        }}
      />
    </div>
  );
};

export default SalesTracker;