import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  IndianRupee,
  Save,
  RotateCcw,
  Fuel,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import UnifiedRecords from './UnifiedRecords';

const PriceConfiguration = ({ 
  isDarkMode, 
  fuelSettings, 
  setFuelSettings, 
  selectedDate,
  salesData,
  creditData,
  incomeData,
  expenseData
}) => {
  const [tempPrices, setTempPrices] = useState(() => {
    // Initialize temp prices with current prices
    const prices = {};
    Object.entries(fuelSettings).forEach(([fuelType, config]) => {
      prices[fuelType] = config.price.toString();
    });
    return prices;
  });
  
  const { toast } = useToast();

  const updateTempPrice = (fuelType, price) => {
    setTempPrices(prev => ({
      ...prev,
      [fuelType]: price
    }));
  };

  const savePrices = () => {
    let hasChanges = false;
    let hasErrors = false;
    
    const newSettings = { ...fuelSettings };
    
    Object.entries(tempPrices).forEach(([fuelType, priceStr]) => {
      const price = parseFloat(priceStr);
      if (isNaN(price) || price <= 0) {
        hasErrors = true;
        return;
      }
      
      if (newSettings[fuelType] && newSettings[fuelType].price !== price) {
        newSettings[fuelType] = {
          ...newSettings[fuelType],
          price: price
        };
        hasChanges = true;
      }
    });
    
    if (hasErrors) {
      toast({
        title: "Invalid Prices",
        description: "Please enter valid prices (greater than 0) for all fuel types",
        variant: "destructive",
      });
      return;
    }
    
    if (!hasChanges) {
      toast({
        title: "No Changes",
        description: "Prices are already up to date",
      });
      return;
    }
    
    setFuelSettings(newSettings);
    
    toast({
      title: "R.S.P. Updated",
      description: `Fuel R.S.P. updated for ${selectedDate}`,
    });
  };

  const resetPrices = () => {
    const resetPrices = {};
    Object.entries(fuelSettings).forEach(([fuelType, config]) => {
      resetPrices[fuelType] = config.price.toString();
    });
    setTempPrices(resetPrices);
    
    toast({
      title: "Prices Reset",
      description: "Prices have been reset to current values",
    });
  };

  const applyQuickPriceChange = (percentage) => {
    const newPrices = {};
    Object.entries(fuelSettings).forEach(([fuelType, config]) => {
      const newPrice = config.price * (1 + percentage / 100);
      newPrices[fuelType] = newPrice.toFixed(2);
    });
    setTempPrices(newPrices);
    
    toast({
      title: "Quick Price Update",
      description: `Applied ${percentage > 0 ? '+' : ''}${percentage}% change to all prices`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Configuration Form */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              R.S.P. Configuration for {selectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Quick Price Actions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Price Adjustments</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(2)}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    +2%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(5)}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    +5%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(-2)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    -2%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(-5)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    -5%
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Individual Fuel Price Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Fuel Prices (₹ per Liter)</Label>
                {Object.entries(fuelSettings).map(([fuelType, config]) => (
                  <div key={fuelType} className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 border-0">
                          {fuelType}
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {config.nozzleCount} nozzle{config.nozzleCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Current: ₹{config.price}/L
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium min-w-0">New Price:</Label>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-slate-500" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={tempPrices[fuelType] || ''}
                          onChange={(e) => updateTempPrice(fuelType, e.target.value)}
                          placeholder="0.00"
                          className="w-24"
                        />
                        <span className="text-sm text-slate-500">/L</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={savePrices} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Prices
                </Button>
                <Button variant="outline" onClick={resetPrices}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price History / Summary */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Current R.S.P. Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-3">
                {Object.entries(fuelSettings).length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Fuel className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No fuel types configured</p>
                    <p className="text-xs">Add fuel types in Settings</p>
                  </div>
                ) : (
                  Object.entries(fuelSettings).map(([fuelType, config]) => (
                    <div key={fuelType} className={`border rounded-lg p-4 ${
                      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-white'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-100 text-purple-800 border-0">
                          {fuelType}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            {config.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-slate-500">/L</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Nozzles:</span>
                          <span className="font-medium">{config.nozzleCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date:</span>
                          <span className="font-medium">{selectedDate}</span>
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
      />
    </div>
  );
};

export default PriceConfiguration;