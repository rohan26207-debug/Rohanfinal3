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
  Moon,
  Sun,
  Fuel,
  IndianRupee,
  TrendingUp,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import SalesTracker from './SalesTracker';
import CreditSales from './CreditSales';
import IncomeExpense from './IncomeExpense';
import PriceConfiguration from './PriceConfiguration';
import HeaderSettings from './HeaderSettings';

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

    // Update mock data to have different dates for testing
    const mockSalesDataWithDates = [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0], // Today
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
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Yesterday
        nozzle: 'D1',
        fuelType: 'Diesel',
        startReading: 890.20,
        endReading: 905.50,
        liters: 15.30,
        rate: 89.75,
        amount: 1373.18,
        type: 'cash'
      },
      {
        id: 3,
        date: new Date().toISOString().split('T')[0], // Today
        nozzle: 'P2',
        fuelType: 'Petrol',
        startReading: 2340.20,
        endReading: 2355.75,
        liters: 15.55,
        rate: 102.50,
        amount: 1593.88,
        type: 'cash'
      }
    ];

    const mockCreditDataWithDates = [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0], // Today
        customerName: 'ABC Transport Ltd.',
        vehicleNumber: 'MH 12 AB 1234',
        fuelType: 'Diesel',
        liters: 50.0,
        rate: 89.75,
        amount: 4487.50,
        dueDate: '2024-02-15',
        status: 'pending'
      },
      {
        id: 2,
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Yesterday
        customerName: 'XYZ Logistics',
        vehicleNumber: 'MH 14 CD 5678',
        fuelType: 'Petrol',
        liters: 30.0,
        rate: 102.50,
        amount: 3075.00,
        dueDate: '2024-02-10',
        status: 'paid'
      }
    ];

    setSalesData(mockSalesDataWithDates);
    setCreditData(mockCreditDataWithDates);
    
    // Initialize default fuel settings
    const defaultFuelSettings = {
      'Petrol': { price: 102.50, nozzleCount: 3 },
      'Diesel': { price: 89.75, nozzleCount: 2 },
      'CNG': { price: 75.20, nozzleCount: 2 },
      'Premium': { price: 108.90, nozzleCount: 1 }
    };
    setFuelSettings(defaultFuelSettings);

    // Initialize income/expense mock data with different dates
    const mockIncomeData = [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0], // Today
        amount: 15000.00,
        description: 'Daily fuel sales revenue',
        type: 'income'
      },
      {
        id: 2,
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Yesterday
        amount: 2500.00,
        description: 'Vehicle service and maintenance charges',
        type: 'income'
      }
    ];

    const mockExpenseData = [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0], // Today
        amount: 3000.00,
        description: 'Daily staff wages',
        type: 'expense'
      },
      {
        id: 2,
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Yesterday
        amount: 1200.00,
        description: 'Monthly electricity bill',
        type: 'expense'
      }
    ];

    setIncomeData(mockIncomeData);
    setExpenseData(mockExpenseData);
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
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTodayStats = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);
    
    // Base cash from fuel sales
    const fuelCashSales = todaySales.reduce((sum, sale) => sum + (sale.type === 'cash' ? sale.amount : 0), 0);
    
    // Other income adds to cash
    const otherIncome = todayIncome.reduce((sum, income) => sum + income.amount, 0);
    
    // Expenses reduce cash
    const totalExpenses = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate credit amount
    const creditAmount = todayCredits.reduce((sum, credit) => sum + credit.amount, 0);
    
    // Adjusted cash sales = fuel cash + other income - expenses - credit sales
    const adjustedCashSales = fuelCashSales + otherIncome - totalExpenses - creditAmount;
    const totalLiters = todaySales.reduce((sum, sale) => sum + sale.liters, 0);
    
    // Total income is fuel sales + other income
    const totalIncome = fuelCashSales + otherIncome;
    
    // Net cash position (what's actually in hand)
    const netCash = adjustedCashSales;
    
    return { 
      fuelCashSales,
      adjustedCashSales,
      creditAmount, 
      totalLiters, 
      totalSales: fuelCashSales + creditAmount,
      otherIncome,
      totalIncome,
      totalExpenses,
      netCash
    };
  };

  const stats = getTodayStats();

  // Export functions
  const exportToPDF = () => {
    const content = generateExportContent();
    
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #333; margin-bottom: 10px;">Fuel Pump Daily Report</h1>
        <h2 style="text-align: center; color: #666; margin-bottom: 30px;">Date: ${selectedDate}</h2>
        
        <div style="margin: 20px 0; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
          <h3 style="color: #333; margin-bottom: 15px;">Daily Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Cash in Hand:</strong></td><td style="padding: 5px; border-bottom: 1px solid #eee;">₹${stats.adjustedCashSales.toFixed(2)}</td></tr>
            <tr><td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Credit Sales:</strong></td><td style="padding: 5px; border-bottom: 1px solid #eee;">₹${stats.creditAmount.toFixed(2)}</td></tr>
            <tr><td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Total Liters:</strong></td><td style="padding: 5px; border-bottom: 1px solid #eee;">${stats.totalLiters.toFixed(2)}L</td></tr>
            <tr><td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Fuel Cash Sales:</strong></td><td style="padding: 5px; border-bottom: 1px solid #eee;">₹${stats.fuelCashSales.toFixed(2)}</td></tr>
            <tr><td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Other Income:</strong></td><td style="padding: 5px; border-bottom: 1px solid #eee;">₹${stats.otherIncome.toFixed(2)}</td></tr>
            <tr><td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Total Expenses:</strong></td><td style="padding: 5px; border-bottom: 1px solid #eee;">₹${stats.totalExpenses.toFixed(2)}</td></tr>
          </table>
        </div>
        
        ${content}
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Fuel Pump Report - ${selectedDate}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToCSV = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fuel_pump_report_${selectedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = () => {
    const textContent = generateTextContent();
    navigator.clipboard.writeText(textContent).then(() => {
      alert('Daily report copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Daily report copied to clipboard!');
    });
  };

  const generateExportContent = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    let content = '';
    
    if (todaySales.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #2563eb;">Fuel Sales (' + todaySales.length + ')</h3>';
      todaySales.forEach(sale => {
        content += `<p style="margin: 5px 0; padding: 8px; background: #f8fafc; border-left: 3px solid #2563eb;"><strong>${sale.nozzle} - ${sale.fuelType}:</strong> ₹${sale.amount.toFixed(2)} (${sale.liters}L @ ₹${sale.rate}/L) - Reading: ${sale.startReading}L → ${sale.endReading}L</p>`;
      });
      content += '</div>';
    }

    if (todayCredits.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #ea580c;">Credit Sales (' + todayCredits.length + ')</h3>';
      todayCredits.forEach(credit => {
        content += `<p style="margin: 5px 0; padding: 8px; background: #fff7ed; border-left: 3px solid #ea580c;"><strong>${credit.customerName}</strong> (${credit.vehicleNumber || 'N/A'}): ₹${credit.amount.toFixed(2)} (${credit.liters}L ${credit.fuelType} @ ₹${credit.rate}/L)</p>`;
      });
      content += '</div>';
    }

    if (todayIncome.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #16a34a;">Income (' + todayIncome.length + ')</h3>';
      todayIncome.forEach(income => {
        content += `<p style="margin: 5px 0; padding: 8px; background: #f0fdf4; border-left: 3px solid #16a34a;"><strong>₹${income.amount.toFixed(2)}:</strong> ${income.description}</p>`;
      });
      content += '</div>';
    }

    if (todayExpenses.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #dc2626;">Expenses (' + todayExpenses.length + ')</h3>';
      todayExpenses.forEach(expense => {
        content += `<p style="margin: 5px 0; padding: 8px; background: #fef2f2; border-left: 3px solid #dc2626;"><strong>₹${expense.amount.toFixed(2)}:</strong> ${expense.description}</p>`;
      });
      content += '</div>';
    }

    return content;
  };

  const generateCSVContent = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    let csv = `Fuel Pump Daily Report - ${selectedDate}\n\n`;
    
    csv += 'SUMMARY\n';
    csv += 'Metric,Value\n';
    csv += `Cash in Hand,₹${stats.adjustedCashSales.toFixed(2)}\n`;
    csv += `Credit Sales,₹${stats.creditAmount.toFixed(2)}\n`;
    csv += `Total Liters,${stats.totalLiters.toFixed(2)}L\n`;
    csv += `Fuel Cash Sales,₹${stats.fuelCashSales.toFixed(2)}\n`;
    csv += `Other Income,₹${stats.otherIncome.toFixed(2)}\n`;
    csv += `Total Expenses,₹${stats.totalExpenses.toFixed(2)}\n\n`;
    
    csv += 'DETAILED RECORDS\n';
    csv += 'Type,Description,Amount,Details,Date\n';
    
    todaySales.forEach(sale => {
      csv += `"Fuel Sale","${sale.nozzle} - ${sale.fuelType}","₹${sale.amount.toFixed(2)}","${sale.liters}L @ ₹${sale.rate}/L (${sale.startReading}L → ${sale.endReading}L)","${sale.date}"\n`;
    });

    todayCredits.forEach(credit => {
      csv += `"Credit Sale","${credit.customerName} - ${credit.vehicleNumber || 'N/A'}","₹${credit.amount.toFixed(2)}","${credit.liters}L ${credit.fuelType} @ ₹${credit.rate}/L","${credit.date}"\n`;
    });

    todayIncome.forEach(income => {
      csv += `"Income","${income.description}","₹${income.amount.toFixed(2)}","","${income.date}"\n`;
    });

    todayExpenses.forEach(expense => {
      csv += `"Expense","${expense.description}","₹${expense.amount.toFixed(2)}","","${expense.date}"\n`;
    });

    return csv;
  };

  const generateTextContent = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    let text = `FUEL PUMP DAILY REPORT - ${selectedDate}\n`;
    text += `==========================================\n\n`;
    
    text += `DAILY SUMMARY:\n`;
    text += `• Cash in Hand: ₹${stats.adjustedCashSales.toFixed(2)}\n`;
    text += `• Credit Sales: ₹${stats.creditAmount.toFixed(2)}\n`;
    text += `• Total Liters: ${stats.totalLiters.toFixed(2)}L\n`;
    text += `• Fuel Cash Sales: ₹${stats.fuelCashSales.toFixed(2)}\n`;
    text += `• Other Income: ₹${stats.otherIncome.toFixed(2)}\n`;
    text += `• Total Expenses: ₹${stats.totalExpenses.toFixed(2)}\n\n`;
    
    if (todaySales.length > 0) {
      text += `FUEL SALES (${todaySales.length}):\n`;
      todaySales.forEach(sale => {
        text += `• ${sale.nozzle} - ${sale.fuelType}: ₹${sale.amount.toFixed(2)} (${sale.liters}L @ ₹${sale.rate}/L) [${sale.startReading}L → ${sale.endReading}L]\n`;
      });
      text += '\n';
    }

    if (todayCredits.length > 0) {
      text += `CREDIT SALES (${todayCredits.length}):\n`;
      todayCredits.forEach(credit => {
        text += `• ${credit.customerName} (${credit.vehicleNumber || 'N/A'}): ₹${credit.amount.toFixed(2)} (${credit.liters}L ${credit.fuelType} @ ₹${credit.rate}/L)\n`;
      });
      text += '\n';
    }

    if (todayIncome.length > 0) {
      text += `INCOME (${todayIncome.length}):\n`;
      todayIncome.forEach(income => {
        text += `• ₹${income.amount.toFixed(2)}: ${income.description}\n`;
      });
      text += '\n';
    }

    if (todayExpenses.length > 0) {
      text += `EXPENSES (${todayExpenses.length}):\n`;
      todayExpenses.forEach(expense => {
        text += `• ₹${expense.amount.toFixed(2)}: ${expense.description}\n`;
      });
      text += '\n';
    }

    text += `Report generated on: ${new Date().toLocaleString()}\n`;
    return text;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-full">
                <Fuel className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Manager Petrol Pump Calculator
                </h1>
              </div>
            </div>
            
            {/* Settings Dropdown */}
            <HeaderSettings 
              isDarkMode={isDarkMode}
              fuelSettings={fuelSettings}
              setFuelSettings={setFuelSettings}
            />
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

        {/* Export Section */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg mb-4`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className={`w-5 h-5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <Label className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Export Daily Report
                  </Label>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Summary + All Records for {selectedDate}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToPDF}
                  className={`${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className={`${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Download className="w-4 h-4 mr-1" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className={`${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    Cash in Hand
                  </p>
                  <p className={`text-xl font-bold ${
                    stats.adjustedCashSales >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{stats.adjustedCashSales.toFixed(2)}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-slate-500'
                  }`}>
                    Fuel: ₹{stats.fuelCashSales.toFixed(0)} + Inc: ₹{stats.otherIncome.toFixed(0)} - Exp: ₹{stats.totalExpenses.toFixed(0)} - Credit: ₹{stats.creditAmount.toFixed(0)}
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

        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-4 mb-6 ${
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
            <TabsTrigger value="prices" className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Rate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <SalesTracker 
              isDarkMode={isDarkMode}
              salesData={salesData}
              setSalesData={setSalesData}
              fuelSettings={fuelSettings}
              selectedDate={selectedDate}
              creditData={creditData}
              incomeData={incomeData}
              expenseData={expenseData}
            />
          </TabsContent>

          <TabsContent value="credit">
            <CreditSales 
              isDarkMode={isDarkMode}
              creditData={creditData}
              setCreditData={setCreditData}
              fuelSettings={fuelSettings}
              selectedDate={selectedDate}
              salesData={salesData}
              incomeData={incomeData}
              expenseData={expenseData}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <IncomeExpense 
              isDarkMode={isDarkMode}
              incomeData={incomeData}
              setIncomeData={setIncomeData}
              expenseData={expenseData}
              setExpenseData={setExpenseData}
              selectedDate={selectedDate}
              salesData={salesData}
              creditData={creditData}
            />
          </TabsContent>

          <TabsContent value="prices">
            <PriceConfiguration 
              isDarkMode={isDarkMode}
              fuelSettings={fuelSettings}
              setFuelSettings={setFuelSettings}
              selectedDate={selectedDate}
              salesData={salesData}
              creditData={creditData}
              incomeData={incomeData}
              expenseData={expenseData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ZAPTRStyleCalculator;