import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Fuel, Calculator, Receipt, RotateCcw, IndianRupee, Droplets } from 'lucide-react';
import TransactionHistory from './TransactionHistory';
import { useToast } from '../hooks/use-toast';
import { mockData } from '../utils/mockData';

const PetrolPumpCalculator = () => {
  const [fuelType, setFuelType] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [amountReceived, setAmountReceived] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load mock transactions on component mount
    setTransactions(mockData.transactions);
  }, []);

  useEffect(() => {
    if (pricePerLiter && quantity) {
      const total = parseFloat(pricePerLiter) * parseFloat(quantity);
      setTotalCost(total);
    } else {
      setTotalCost(0);
    }
  }, [pricePerLiter, quantity]);

  useEffect(() => {
    if (amountReceived && totalCost) {
      const change = parseFloat(amountReceived) - totalCost;
      setChangeAmount(change > 0 ? change : 0);
    } else {
      setChangeAmount(0);
    }
  }, [amountReceived, totalCost]);

  const handleFuelTypeChange = (value) => {
    setFuelType(value);
    const selectedFuel = mockData.fuelTypes.find(fuel => fuel.type === value);
    if (selectedFuel) {
      setPricePerLiter(selectedFuel.price.toString());
    }
  };

  const handleTransaction = () => {
    if (!fuelType || !quantity || !amountReceived) {
      toast({
        title: "Incomplete Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amountReceived) < totalCost) {
      toast({
        title: "Insufficient Payment",
        description: "Amount received is less than total cost",
        variant: "destructive",
      });
      return;
    }

    const newTransaction = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      fuelType,
      quantity: parseFloat(quantity),
      pricePerLiter: parseFloat(pricePerLiter),
      totalCost,
      amountReceived: parseFloat(amountReceived),
      changeAmount
    };

    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Transaction Completed",
      description: `₹${totalCost.toFixed(2)} transaction processed successfully`,
    });

    // Reset form
    handleReset();
  };

  const handleReset = () => {
    setFuelType('');
    setPricePerLiter('');
    setQuantity('');
    setTotalCost(0);
    setAmountReceived('');
    setChangeAmount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Fuel className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">FuelCalc Pro</h1>
          </div>
          <p className="text-slate-600 text-lg">Professional Petrol Pump Calculator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="w-6 h-6" />
                  Fuel Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Fuel Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuelType" className="text-sm font-medium text-slate-700">
                      Fuel Type
                    </Label>
                    <Select value={fuelType} onValueChange={handleFuelTypeChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData.fuelTypes.map((fuel) => (
                          <SelectItem key={fuel.type} value={fuel.type}>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4" />
                              {fuel.type} - ₹{fuel.price}/L
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-slate-700">
                      Price per Liter (₹)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={pricePerLiter}
                      onChange={(e) => setPricePerLiter(e.target.value)}
                      placeholder="0.00"
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                    Quantity (Liters)
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    className="h-12 text-lg"
                  />
                </div>

                {/* Total Cost Display */}
                <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-slate-700">Total Cost:</span>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                      <span className="text-3xl font-bold text-green-600">
                        {totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Payment Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="received" className="text-sm font-medium text-slate-700">
                        Amount Received (₹)
                      </Label>
                      <Input
                        id="received"
                        type="number"
                        step="0.01"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        placeholder="0.00"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Change to Return
                      </Label>
                      <div className="h-12 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md flex items-center">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-orange-600" />
                          <span className="text-lg font-semibold text-orange-600">
                            {changeAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleTransaction}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    Complete Transaction
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="h-12 px-6 border-slate-300 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-1">
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetrolPumpCalculator;