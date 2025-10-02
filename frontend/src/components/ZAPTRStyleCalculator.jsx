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
  Share2
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import SalesTracker from './SalesTracker';
import CreditSales from './CreditSales';
import IncomeExpense from './IncomeExpense';
import PriceConfiguration from './PriceConfiguration';
import HeaderSettings from './HeaderSettings';
import localStorageService from '../services/localStorage';

const ZAPTRStyleCalculator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');
  const [salesData, setSalesData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [fuelSettings, setFuelSettings] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  // Load data from localStorage
  // Loading state removed per user request

  const loadData = () => {
    try {
      // Load all data from localStorage
      const salesData = localStorageService.getSalesData();
      const creditData = localStorageService.getCreditData();
      const incomeData = localStorageService.getIncomeData();
      const expenseData = localStorageService.getExpenseData();
      const fuelSettings = localStorageService.getFuelSettings();

      // Set data in component state
      setSalesData(salesData);
      setCreditData(creditData);
      setIncomeData(incomeData);
      setExpenseData(expenseData);
      setFuelSettings(fuelSettings);

    } catch (err) {
      console.error('Failed to load data from localStorage:', err);
      
      // Initialize with empty data if localStorage fails
      setSalesData([]);
      setCreditData([]);
      setIncomeData([]);
      setExpenseData([]);
      
      // Initialize default fuel settings
      const defaultFuelSettings = {
        'Petrol': { price: 102.50, nozzleCount: 3 },
        'Diesel': { price: 89.75, nozzleCount: 2 },
        'CNG': { price: 75.20, nozzleCount: 2 },
        'Premium': { price: 108.90, nozzleCount: 1 }
      };
      setFuelSettings(defaultFuelSettings);
      localStorageService.setFuelSettings(defaultFuelSettings);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when date changes (to reflect any new data)
  useEffect(() => {
    loadData();
  }, [selectedDate]);

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

    // Calculate fuel sales by fuel type
    const fuelSalesByType = {};
    todaySales.forEach(sale => {
      if (!fuelSalesByType[sale.fuelType]) {
        fuelSalesByType[sale.fuelType] = { liters: 0, amount: 0 };
      }
      fuelSalesByType[sale.fuelType].liters += sale.liters;
      fuelSalesByType[sale.fuelType].amount += sale.amount;
    });
    
    // Base cash from fuel sales
    const fuelCashSales = todaySales.reduce((sum, sale) => sum + (sale.type === 'cash' ? sale.amount : 0), 0);
    
    // Other income adds to cash
    const otherIncome = todayIncome.reduce((sum, income) => sum + income.amount, 0);
    
    // Expenses reduce cash
    const totalExpenses = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate credit amount and liters
    const creditAmount = todayCredits.reduce((sum, credit) => sum + credit.amount, 0);
    const creditLiters = todayCredits.reduce((sum, credit) => sum + credit.liters, 0);
    
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
      creditLiters,
      totalLiters, 
      totalSales: fuelCashSales + creditAmount,
      otherIncome,
      totalIncome,
      totalExpenses,
      netCash,
      fuelSalesByType
    };
  };

  const stats = getTodayStats();

  // Data handling functions (offline localStorage)
  const addSaleRecord = (saleData) => {
    try {
      const newSale = localStorageService.addSaleRecord({
        ...saleData,
        date: selectedDate
      });
      
      // Update local state immediately
      setSalesData(prev => [...prev, newSale]);
      
      return newSale;
    } catch (error) {
      console.error('Failed to add sale record:', error);
    }
  };

  const addCreditRecord = (creditData) => {
    try {
      const newCredit = localStorageService.addCreditRecord({
        ...creditData,
        date: selectedDate
      });
      
      // Update local state immediately
      setCreditData(prev => [...prev, newCredit]);
      
      return newCredit;
    } catch (error) {
      console.error('Failed to add credit record:', error);
    }
  };

  const addIncomeRecord = (incomeData) => {
    try {
      const newIncome = localStorageService.addIncomeRecord({
        ...incomeData,
        date: selectedDate
      });
      
      // Update local state immediately
      setIncomeData(prev => [...prev, newIncome]);
      
      return newIncome;
    } catch (error) {
      console.error('Failed to add income record:', error);
    }
  };

  const addExpenseRecord = (expenseData) => {
    try {
      const newExpense = localStorageService.addExpenseRecord({
        ...expenseData,
        date: selectedDate
      });
      
      // Update local state immediately
      setExpenseData(prev => [...prev, newExpense]);
      
      return newExpense;
    } catch (error) {
      console.error('Failed to add expense record:', error);
    }
  };

  // Delete functions
  const deleteSaleRecord = (id) => {
    try {
      const success = localStorageService.deleteSaleRecord(id);
      if (success) {
        setSalesData(prev => prev.filter(sale => sale.id !== id));
        toast({ title: "Success", description: "Sale record deleted successfully" });
        return true;
      }
    } catch (error) {
      console.error('Failed to delete sale record:', error);
      toast({ title: "Error", description: "Failed to delete sale record", variant: "destructive" });
    }
    return false;
  };

  const deleteCreditRecord = (id) => {
    try {
      const success = localStorageService.deleteCreditRecord(id);
      if (success) {
        setCreditData(prev => prev.filter(credit => credit.id !== id));
        toast({ title: "Success", description: "Credit record deleted successfully" });
        return true;
      }
    } catch (error) {
      console.error('Failed to delete credit record:', error);
      toast({ title: "Error", description: "Failed to delete credit record", variant: "destructive" });
    }
    return false;
  };

  const deleteIncomeRecord = (id) => {
    try {
      const success = localStorageService.deleteIncomeRecord(id);
      if (success) {
        setIncomeData(prev => prev.filter(income => income.id !== id));
        toast({ title: "Success", description: "Income record deleted successfully" });
        return true;
      }
    } catch (error) {
      console.error('Failed to delete income record:', error);
      toast({ title: "Error", description: "Failed to delete income record", variant: "destructive" });
    }
    return false;
  };

  const deleteExpenseRecord = (id) => {
    try {
      const success = localStorageService.deleteExpenseRecord(id);
      if (success) {
        setExpenseData(prev => prev.filter(expense => expense.id !== id));
        toast({ title: "Success", description: "Expense record deleted successfully" });
        return true;
      }
    } catch (error) {
      console.error('Failed to delete expense record:', error);
      toast({ title: "Error", description: "Failed to delete expense record", variant: "destructive" });
    }
    return false;
  };

  // Update functions
  const updateSaleRecord = (id, updatedData) => {
    try {
      const updatedSale = localStorageService.updateSaleRecord(id, updatedData);
      if (updatedSale) {
        setSalesData(prev => prev.map(sale => sale.id === id ? updatedSale : sale));
        toast({ title: "Success", description: "Sale record updated successfully" });
        return updatedSale;
      }
    } catch (error) {
      console.error('Failed to update sale record:', error);
      toast({ title: "Error", description: "Failed to update sale record", variant: "destructive" });
    }
    return null;
  };

  const updateCreditRecord = (id, updatedData) => {
    try {
      const updatedCredit = localStorageService.updateCreditRecord(id, updatedData);
      if (updatedCredit) {
        setCreditData(prev => prev.map(credit => credit.id === id ? updatedCredit : credit));
        toast({ title: "Success", description: "Credit record updated successfully" });
        return updatedCredit;
      }
    } catch (error) {
      console.error('Failed to update credit record:', error);
      toast({ title: "Error", description: "Failed to update credit record", variant: "destructive" });
    }
    return null;
  };

  const updateIncomeRecord = (id, updatedData) => {
    try {
      const updatedIncome = localStorageService.updateIncomeRecord(id, updatedData);
      if (updatedIncome) {
        setIncomeData(prev => prev.map(income => income.id === id ? updatedIncome : income));
        toast({ title: "Success", description: "Income record updated successfully" });
        return updatedIncome;
      }
    } catch (error) {
      console.error('Failed to update income record:', error);
      toast({ title: "Error", description: "Failed to update income record", variant: "destructive" });
    }
    return null;
  };

  const updateExpenseRecord = (id, updatedData) => {
    try {
      const updatedExpense = localStorageService.updateExpenseRecord(id, updatedData);
      if (updatedExpense) {
        setExpenseData(prev => prev.map(expense => expense.id === id ? updatedExpense : expense));
        toast({ title: "Success", description: "Expense record updated successfully" });
        return updatedExpense;
      }
    } catch (error) {
      console.error('Failed to update expense record:', error);
      toast({ title: "Error", description: "Failed to update expense record", variant: "destructive" });
    }
    return null;
  };

  const updateFuelRate = (fuelType, rate) => {
    try {
      const success = localStorageService.updateFuelRate(fuelType, rate);
      
      if (success) {
        // Update local state immediately
        setFuelSettings(prev => ({
          ...prev,
          [fuelType]: { ...prev[fuelType], price: parseFloat(rate) }
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Failed to update fuel rate:', error);
      return false;
    }
  };

  // Export functions
  const exportToPDF = () => {
    try {
      const todaySales = salesData.filter(sale => sale.date === selectedDate);
      const todayCredits = creditData.filter(credit => credit.date === selectedDate);
      const todayIncome = incomeData.filter(income => income.date === selectedDate);
      const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

      // Create HTML content for PDF
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>M.Pump Calc Daily Report - ${selectedDate}</title>
<style>
body{font:Arial;margin:10px;line-height:1.2}
h1{font-size:28px;margin:0;text-align:center}
p{font-size:18px;margin:2px 0;text-align:center}
.s{margin:15px 0 5px 0;font-size:18px;font-weight:bold}
table{width:100%;border-collapse:collapse;font-size:14px;margin:5px 0}
th{background:#f0f0f0;border:1px solid #000;padding:4px;text-align:center;font-weight:bold;font-size:15px}
td{border:1px solid #000;padding:3px;font-size:14px}
.r{text-align:right}
.c{text-align:center}
.t{font-weight:bold;background:#f8f8f8}
.print-btn{background:#007bff;color:white;border:none;padding:10px 20px;font-size:16px;cursor:pointer;border-radius:5px;margin:10px auto;display:block;box-shadow:0 2px 4px rgba(0,0,0,0.2)}
.print-btn:hover{background:#0056b3}
.no-print{display:block}
@media print{body{margin:8mm}.no-print{display:none}}
</style>
</head>
<body>
<h1>M.Pump Calc Daily Report</h1>
<p>${selectedDate}</p>

<div class="s">SUMMARY</div>
<table>
<tr><th>Category<th>Litres<th>Amount</tr>
${Object.entries(stats.fuelSalesByType).map(([fuelType, data], index) => 
  `<tr><td>${index + 1}. ${fuelType} Sales<td class="r">${data.liters.toFixed(2)}<td class="r">₹${data.amount.toFixed(2)}</tr>`
).join('')}
${Object.keys(stats.fuelSalesByType).length > 1 ? `<tr class="t"><td>Total Reading Sales<td class="r">${stats.totalLiters.toFixed(2)}<td class="r">₹${stats.fuelCashSales.toFixed(2)}</tr>` : ''}
<tr><td>${Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 2 : 1)}. Credit Sales<td class="r">${stats.creditLiters.toFixed(2)}<td class="r">₹${stats.creditAmount.toFixed(2)}</tr>
<tr><td>${Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 3 : 2)}. Income<td class="r">-<td class="r">₹${stats.otherIncome.toFixed(2)}</tr>
<tr><td>${Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 4 : 3)}. Expenses<td class="r">-<td class="r">₹${stats.totalExpenses.toFixed(2)}</tr>
<tr class="t"><td>Cash in Hand<td class="r">-<td class="r">₹${stats.adjustedCashSales.toFixed(2)}</tr>
</table>

${todaySales.length > 0 ? `
<div class="s">READING SALES</div>
<table>
<tr><th>Nozzle<th>Fuel Type<th>Start<th>End<th>Liters<th>Rate<th>Amount</tr>
${todaySales.map(sale => 
  `<tr><td class="c">${sale.nozzle}<td>${sale.fuelType}<td class="r">${sale.startReading}<td class="r">${sale.endReading}<td class="r">${sale.liters.toFixed(2)}<td class="r">₹${sale.rate.toFixed(2)}<td class="r"><b>₹${sale.amount.toFixed(2)}</b></tr>`
).join('')}
<tr class="t"><td colspan="4">Total Reading Sales<td class="r">${stats.totalLiters.toFixed(2)}<td class="r">-<td class="r"><b>₹${stats.fuelCashSales.toFixed(2)}</b></tr>
</table>` : ''}

${todayCredits.length > 0 ? `
<div class="s">CREDIT SALES</div>
<table>
<tr><th>Customer<th>Vehicle<th>Fuel Type<th>Liters<th>Rate<th>Amount</tr>
${todayCredits.map(credit => 
  `<tr><td>${credit.customerName}<td class="c">${credit.vehicleNumber || 'N/A'}<td>${credit.fuelType || 'N/A'}<td class="r">${credit.liters ? credit.liters.toFixed(2) : 'N/A'}<td class="r">₹${credit.rate ? credit.rate.toFixed(2) : 'N/A'}<td class="r"><b>₹${credit.amount.toFixed(2)}</b></tr>`
).join('')}
<tr class="t"><td colspan="5">Total Credit Sales<td class="r"><b>₹${stats.creditAmount.toFixed(2)}</b></tr>
</table>` : ''}

${todayIncome.length > 0 || todayExpenses.length > 0 ? `
<div class="s">INCOME & EXPENSES</div>
<table>
<tr><th>Type<th>Description<th>Amount</tr>
${todayIncome.map(income => `<tr><td>Income<td>${income.description}<td class="r">₹${income.amount.toFixed(2)}</tr>`).join('')}
${todayExpenses.map(expense => `<tr><td>Expense<td>${expense.description}<td class="r">₹${expense.amount.toFixed(2)}</tr>`).join('')}
</table>` : ''}

<div style="margin-top:15px;text-align:center;font-size:10px;border-top:1px solid #000;padding-top:5px">
Generated on: ${new Date().toLocaleString()}
</div>

<div class="no-print" style="text-align:center;margin:20px 0">
<button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
</div>

<script>
// Auto print on load (with delay for content loading)
window.onload = function() {
  setTimeout(() => {
    window.print();
  }, 500);
};
</script>
</body>
</html>`;

      // Open in new window for printing/PDF generation
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Please allow pop-ups for this site to enable PDF export and printing.');
        return;
      }
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Focus window and show user feedback
      printWindow.focus();
      
      // Show user feedback
      setTimeout(() => {
        toast({
          title: "Print Preview Opened",
          description: "Print dialog will appear automatically. You can also click the print button in the preview window."
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Debug function removed

  // CSV export function removed per user request

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

  // PDF export content generation function removed

  // CSV content generation function removed per user request

  const generateTextContent = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    let text = `Date: ${selectedDate}\n\n`;
    
    // Summary section
    text += `*Summary*\n`;
    Object.entries(stats.fuelSalesByType).forEach(([fuelType, data]) => {
      text += `${fuelType} Sales: ${data.liters.toFixed(2)}L - ₹${data.amount.toFixed(2)}\n`;
    });
    text += `Credit Sales: ${stats.creditLiters.toFixed(2)}L - ₹${stats.creditAmount.toFixed(2)}\n`;
    text += `Income: ₹${stats.otherIncome.toFixed(2)}\n`;
    text += `Expenses: ₹${stats.totalExpenses.toFixed(2)}\n`;
    text += `Cash in Hand: ₹${stats.adjustedCashSales.toFixed(2)}\n`;
    text += `-------\n\n`;
    
    // *Readings* section
    if (todaySales.length > 0) {
      text += `*Readings*\n`;
      todaySales.forEach((sale, index) => {
        text += `${index + 1}. Readings:\n`;
        text += ` Description: ${sale.nozzle}\n`;
        text += ` Starting: ${sale.startReading}\n`;
        text += ` Ending: ${sale.endReading}\n`;
        text += ` Litres: ${sale.liters}\n`;
        text += ` Rate: ${sale.rate}\n`;
        text += ` Amount: ${sale.amount.toFixed(2)}\n`;
      });
      text += `*Readings Total: ${stats.fuelCashSales.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    // *Credits* section
    if (todayCredits.length > 0) {
      text += `*Credits*\n`;
      todayCredits.forEach((credit, index) => {
        text += `${index + 1}. Credit:\n`;
        text += ` Description: ${credit.customerName}\n`;
        text += ` Litre: ${credit.liters}\n`;
        text += ` Rate: ${credit.rate}\n`;
        text += ` Amount: ${credit.amount.toFixed(2)}\n`;
      });
      text += `*Credits Total: ${stats.creditAmount.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    // *Income* section
    if (todayIncome.length > 0) {
      text += `*Income*\n`;
      todayIncome.forEach((income, index) => {
        text += `${index + 1}. Income:\n`;
        text += ` ${income.description}: ${income.amount.toFixed(2)}\n`;
      });
      text += `*Income Total: ${stats.otherIncome.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    // *Expenses* section
    if (todayExpenses.length > 0) {
      text += `*Expenses*\n`;
      todayExpenses.forEach((expense, index) => {
        text += `${index + 1}. Expenses:\n`;
        text += ` ${expense.description}: ${expense.amount.toFixed(2)}\n`;
      });
      text += `*Expenses Total: ${stats.totalExpenses.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    text += `\n************************\n`;
    text += `*Total Amount: ${stats.adjustedCashSales.toFixed(2)}*\n`;
    
    return text;
  };

  // Loading screen removed per user request

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto p-4">
        
        {/* Offline mode display removed per user request */}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Left Side: Settings and App Title */}
          <div className="flex items-center gap-4">
            <HeaderSettings 
              isDarkMode={isDarkMode}
              fuelSettings={fuelSettings}
              setFuelSettings={setFuelSettings}
            />
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-full">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                M.Pump Calc
              </h1>
            </div>
          </div>
          
          {/* Right Side: Dark Mode Toggle */}
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
                    {selectedDate}
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
                  Print/PDF
                </Button>
                {/* CSV export removed per user request */}
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
                  
                  <div className={`border rounded-lg p-2 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700' 
                      : 'border-slate-300 bg-white'
                  }`}>
                    <Input
                      id="date-picker"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`h-8 w-36 border-0 bg-transparent focus:ring-0 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg mb-6`}>
          <CardContent className="p-6">
            <h2 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              Summary
            </h2>
            
            <div className="space-y-3">
              {/* Reading Sales by Fuel Type */}
              {Object.entries(stats.fuelSalesByType).map(([fuelType, data], index) => (
                <div key={fuelType} className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {fuelType} Sales
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {data.liters.toFixed(2)}L • ₹{data.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show total if there are multiple fuel types */}
              {Object.keys(stats.fuelSalesByType).length > 1 && (
                <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-slate-50'
                } border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      T
                    </div>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Total Reading Sales
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {stats.totalLiters.toFixed(2)}L • ₹{stats.fuelCashSales.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Sales */}
              <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-orange-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 2 : 1)}
                  </div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Credit Sales
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {stats.creditLiters.toFixed(2)}L • ₹{stats.creditAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Income */}
              <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-green-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 3 : 2)}
                  </div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Income
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    ₹{stats.otherIncome.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 4 : 3)}
                  </div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Expenses
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    ₹{stats.totalExpenses.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Cash in Hand */}
              <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 5 : 4)}
                  </div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Cash in Hand
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    ₹{stats.adjustedCashSales.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards section removed as requested by user */}

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
              Inc./Exp.
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
              addSaleRecord={addSaleRecord}
              deleteSaleRecord={deleteSaleRecord}
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
              addCreditRecord={addCreditRecord}
              deleteCreditRecord={deleteCreditRecord}
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
              addIncomeRecord={addIncomeRecord}
              deleteIncomeRecord={deleteIncomeRecord}
              expenseData={expenseData}
              addExpenseRecord={addExpenseRecord}
              deleteExpenseRecord={deleteExpenseRecord}
              selectedDate={selectedDate}
              salesData={salesData}
              creditData={creditData}
            />
          </TabsContent>

          <TabsContent value="prices">
            <PriceConfiguration 
              isDarkMode={isDarkMode}
              fuelSettings={fuelSettings}
              updateFuelRate={updateFuelRate}
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