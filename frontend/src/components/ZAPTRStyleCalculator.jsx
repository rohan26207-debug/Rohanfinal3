import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calculator, 
  CreditCard, 
  TrendingDown, 
  FileText, 
  Moon,
  Sun,
  Fuel,
  IndianRupee,
  TrendingUp,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SalesTracker from './SalesTracker';
import CreditSales from './CreditSales';
import IncomeExpense from './IncomeExpense';
import ReportsExport from './ReportsExport';
import FuelSettings from './FuelSettings';

const ZAPTRStyleCalculator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');
  const [salesData, setSalesData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [fuelSettings, setFuelSettings] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data
  useEffect(() => {
    const mockSalesData = [
      {
        id: 1,
        date: '2024-01-15',
        nozzle: 'P1',
        fuelType: 'Petrol',
        startReading: 1250.50,
        endReading: 1275.25,
        liters: 24.75,
        rate: 102.50,
        amount: 2536.88,
        type: 'cash'
      },
      {
        id: 2,
        date: '2024-01-15',
        nozzle: 'D1',
        fuelType: 'Diesel',
        startReading: 890.20,
        endReading: 905.50,
        liters: 15.30,
        rate: 89.75,
        amount: 1373.18,
        type: 'cash'
      }
    ];

    const mockCreditData = [
      {
        id: 1,
        date: '2024-01-15',
        customerName: 'ABC Transport Ltd.',
        vehicleNumber: 'MH 12 AB 1234',
        fuelType: 'Diesel',
        liters: 50.0,
        rate: 89.75,
        amount: 4487.50,
        dueDate: '2024-02-15',
        status: 'pending'
      }
    ];

    setSalesData(mockSalesData);
    setCreditData(mockCreditData);
    
    // Initialize default fuel settings
    const defaultFuelSettings = {
      'Petrol': { price: 102.50, nozzleCount: 3 },
      'Diesel': { price: 89.75, nozzleCount: 2 },
      'CNG': { price: 75.20, nozzleCount: 2 },
      'Premium': { price: 108.90, nozzleCount: 1 }
    };
    setFuelSettings(defaultFuelSettings);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const getTodayStats = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    
    const cashSales = todaySales.reduce((sum, sale) => sum + (sale.type === 'cash' ? sale.amount : 0), 0);
    const creditAmount = todayCredits.reduce((sum, credit) => sum + credit.amount, 0);
    const totalLiters = todaySales.reduce((sum, sale) => sum + sale.liters, 0);
    
    return { cashSales, creditAmount, totalLiters, totalSales: cashSales + creditAmount };
  };

  const stats = getTodayStats();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <Fuel className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Fuel Pump Calculator
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Professional Pump Management System
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="flex items-center gap-2"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light' : 'Dark'}
          </Button>
        </div>

        {/* Date Section */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg mb-6`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-6 h-6 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <Label className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Operating Date
                    </Label>
                    <div className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {formatDisplayDate(selectedDate)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousDay}
                    className={`h-10 w-10 p-0 ${
                      isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextDay}
                    className={`h-10 w-10 p-0 ${
                      isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                    className={`px-4 h-10 ${
                      isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''
                    }`}
                  >
                    Today
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <Label htmlFor="date-picker" className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Select Date
                  </Label>
                  <Input
                    id="date-picker"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`h-10 w-40 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : ''
                    }`}
                  />
                </div>
                
                <div className={`text-center px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-slate-100'
                }`}>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Day {Math.floor((new Date(selectedDate) - new Date(new Date().getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)) + 1}
                  </div>
                  <div className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {new Date(selectedDate).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
          } shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Cash Sales {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : 'Selected Day'}
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{stats.cashSales.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
          } shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Credit Sales
                  </p>
                  <p className="text-xl font-bold text-orange-600">
                    ₹{stats.creditAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
          } shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-blue-600" />
                <div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Total Liters
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {stats.totalLiters.toFixed(2)}L
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
          } shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Total Sales
                  </p>
                  <p className="text-xl font-bold text-purple-600">
                    ₹{stats.totalSales.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-5 mb-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-slate-100'
          }`}>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Reading Sales
            </TabsTrigger>
            <TabsTrigger value="credit" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Credit Sales
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Income/Expenses
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <SalesTracker 
              isDarkMode={isDarkMode}
              salesData={salesData}
              setSalesData={setSalesData}
              fuelSettings={fuelSettings}
              selectedDate={selectedDate}
            />
          </TabsContent>

          <TabsContent value="credit">
            <CreditSales 
              isDarkMode={isDarkMode}
              creditData={creditData}
              setCreditData={setCreditData}
              fuelSettings={fuelSettings}
              selectedDate={selectedDate}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <IncomeExpense 
              isDarkMode={isDarkMode}
              incomeData={incomeData}
              setIncomeData={setIncomeData}
              expenseData={expenseData}
              setExpenseData={setExpenseData}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsExport 
              isDarkMode={isDarkMode}
              salesData={salesData}
              creditData={creditData}
              incomeData={incomeData}
              expenseData={expenseData}
            />
          </TabsContent>

          <TabsContent value="settings">
            <FuelSettings 
              isDarkMode={isDarkMode}
              fuelSettings={fuelSettings}
              setFuelSettings={setFuelSettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ZAPTRStyleCalculator;