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

  // Export functions
  const exportToPDF = () => {
    try {
      // Get today's data
      const todaySales = salesData.filter(sale => sale.date === selectedDate);
      const todayCredits = creditData.filter(credit => credit.date === selectedDate);
      const todayIncome = incomeData.filter(income => income.date === selectedDate);
      const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

      // Create formatted HTML content with tables
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Daily Report - ${selectedDate}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 10px; 
              line-height: 1.2; 
              color: #000;
            }
            .header { 
              text-align: center; 
              margin-bottom: 15px; 
              border-bottom: 2px solid #000; 
              padding-bottom: 5px; 
            }
            .header h1 { 
              font-size: 28px; 
              margin: 0; 
            }
            .header p { 
              font-size: 18px; 
              margin: 2px 0; 
            }
            .section { 
              margin-bottom: 15px; 
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 5px; 
              padding-bottom: 2px; 
            }
            .summary-item { 
              margin: 5px 0; 
              font-size: 16px; 
            }
            .cash-highlight { 
              font-weight: bold; 
              font-size: 18px; 
              margin: 10px 0; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
              font-size: 14px; 
            }
            th { 
              background-color: #f0f0f0; 
              border: 1px solid #000; 
              padding: 10px; 
              text-align: center; 
              font-weight: bold; 
              font-size: 15px;
            }
            td { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: left; 
              font-size: 14px;
            }
            td.number { 
              text-align: right; 
            }
            td.center { 
              text-align: center; 
            }
            .total-row { 
              font-weight: bold; 
              background-color: #f8f8f8; 
            }
            @media print {
              body { margin: 15mm; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Daily Report</h1>
            <p>Date: ${selectedDate}</p>
          </div>
          
          <div class="section">
            <div class="section-title">SUMMARY</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 60%;">Category</th>
                  <th style="width: 20%;">Litres</th>
                  <th style="width: 20%;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(stats.fuelSalesByType).map(([fuelType, data]) => 
                  `<tr>
                    <td>${fuelType} Sales</td>
                    <td class="number">${data.liters.toFixed(2)}L</td>
                    <td class="number">₹${data.amount.toFixed(2)}</td>
                  </tr>`
                ).join('')}
                <tr>
                  <td>Credit Sales</td>
                  <td class="number">${stats.creditLiters.toFixed(2)}L</td>
                  <td class="number">₹${stats.creditAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Income</td>
                  <td class="number">-</td>
                  <td class="number">₹${stats.otherIncome.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Expenses</td>
                  <td class="number">-</td>
                  <td class="number">₹${stats.totalExpenses.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td><strong>Cash in Hand</strong></td>
                  <td class="number"><strong>${stats.totalLiters.toFixed(2)}L</strong></td>
                  <td class="number"><strong>₹${stats.adjustedCashSales.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          ${todaySales.length > 0 ? `
            <div class="section">
              <div class="section-title">SALES RECORDS</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 8%;">Sr.No</th>
                    <th style="width: 22%;">Description</th>
                    <th style="width: 12%;">Start</th>
                    <th style="width: 12%;">End</th>
                    <th style="width: 12%;">Rate</th>
                    <th style="width: 12%;">Litres</th>
                    <th style="width: 12%;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${todaySales.map((sale, index) => 
                    `<tr>
                      <td class="center">${index + 1}</td>
                      <td>${sale.nozzle} - ${sale.fuelType}</td>
                      <td class="number">${sale.startReading}</td>
                      <td class="number">${sale.endReading}</td>
                      <td class="number">₹${sale.rate}</td>
                      <td class="number">${sale.liters}</td>
                      <td class="number">₹${sale.amount.toFixed(2)}</td>
                    </tr>`
                  ).join('')}
                  <tr class="total-row">
                    <td colspan="5" class="number"><strong>Total:</strong></td>
                    <td class="number"><strong>${todaySales.reduce((sum, sale) => sum + parseFloat(sale.liters), 0).toFixed(2)}</strong></td>
                    <td class="number"><strong>₹${todaySales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          ${todayCredits.length > 0 ? `
            <div class="section">
              <div class="section-title">CREDIT RECORDS</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 8%;">Sr.No</th>
                    <th style="width: 35%;">Customer</th>
                    <th style="width: 20%;">Vehicle</th>
                    <th style="width: 12%;">Rate</th>
                    <th style="width: 12%;">Litres</th>
                    <th style="width: 13%;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${todayCredits.map((credit, index) => 
                    `<tr>
                      <td class="center">${index + 1}</td>
                      <td>${credit.customerName}</td>
                      <td>${credit.vehicleNumber || 'N/A'}</td>
                      <td class="number">₹${credit.rate}</td>
                      <td class="number">${credit.liters}</td>
                      <td class="number">₹${credit.amount.toFixed(2)}</td>
                    </tr>`
                  ).join('')}
                  <tr class="total-row">
                    <td colspan="4" class="number"><strong>Total:</strong></td>
                    <td class="number"><strong>${todayCredits.reduce((sum, credit) => sum + parseFloat(credit.liters), 0).toFixed(2)}</strong></td>
                    <td class="number"><strong>₹${todayCredits.reduce((sum, credit) => sum + parseFloat(credit.amount), 0).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          ${todayIncome.length > 0 ? `
            <div class="section">
              <div class="section-title">INCOME RECORDS</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 10%;">Sr.No</th>
                    <th style="width: 70%;">Description</th>
                    <th style="width: 20%;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${todayIncome.map((income, index) => 
                    `<tr>
                      <td class="center">${index + 1}</td>
                      <td>${income.description}</td>
                      <td class="number">₹${income.amount.toFixed(2)}</td>
                    </tr>`
                  ).join('')}
                  <tr class="total-row">
                    <td colspan="2" class="number"><strong>Total Income:</strong></td>
                    <td class="number"><strong>₹${todayIncome.reduce((sum, income) => sum + parseFloat(income.amount), 0).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          ${todayExpenses.length > 0 ? `
            <div class="section">
              <div class="section-title">EXPENSE RECORDS</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 10%;">Sr.No</th>
                    <th style="width: 70%;">Description</th>
                    <th style="width: 20%;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${todayExpenses.map((expense, index) => 
                    `<tr>
                      <td class="center">${index + 1}</td>
                      <td>${expense.description}</td>
                      <td class="number">₹${expense.amount.toFixed(2)}</td>
                    </tr>`
                  ).join('')}
                  <tr class="total-row">
                    <td colspan="2" class="number"><strong>Total Expenses:</strong></td>
                    <td class="number"><strong>₹${todayExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          <div style="margin-top: 30px; text-align: center; font-size: 10px; border-top: 1px solid #000; padding-top: 10px;">
            Generated on: ${new Date().toLocaleString()}
          </div>
        </body>
        </html>
      `;

      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Focus and print
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportToCSV = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `mpump_calculator_report_${selectedDate}.csv`);
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

  // PDF export content generation function removed

  const generateCSVContent = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    let csv = `M.Pump Calc Daily Report - ${selectedDate}\n\n`;
    
    csv += 'SUMMARY\n';
    csv += 'Metric,Value\n';
    
    // Add fuel sales by type
    Object.entries(stats.fuelSalesByType).forEach(([fuelType, data], index) => {
      csv += `${index + 1}. ${fuelType} Sales,${data.liters.toFixed(2)}L • ₹${data.amount.toFixed(2)}\n`;
    });
    
    // Add total if multiple fuel types
    if (Object.keys(stats.fuelSalesByType).length > 1) {
      csv += `Total Reading Sales,${stats.totalLiters.toFixed(2)}L • ₹${stats.fuelCashSales.toFixed(2)}\n`;
    }
    
    csv += `${Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 2 : 1)}. Credit Sales,${stats.creditLiters.toFixed(2)}L • ₹${stats.creditAmount.toFixed(2)}\n`;
    csv += `${Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 3 : 2)}. Income,₹${stats.otherIncome.toFixed(2)}\n`;
    csv += `${Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 4 : 3)}. Expenses,₹${stats.totalExpenses.toFixed(2)}\n`;
    csv += `${Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 5 : 4)}. Cash in Hand,₹${stats.adjustedCashSales.toFixed(2)}\n\n`;
    
    csv += 'DETAILED RECORDS\n';
    csv += 'Type,Description,Amount,Details,Date\n';
    
    todaySales.forEach(sale => {
      csv += `"Fuel Sale","${sale.nozzle} - ${sale.fuelType}","₹${sale.amount.toFixed(2)}","${sale.liters} @ ₹${sale.rate} (${sale.startReading} → ${sale.endReading})","${sale.date}"\n`;
    });

    todayCredits.forEach(credit => {
      csv += `"Credit Sale","${credit.customerName} - ${credit.vehicleNumber || 'N/A'}","₹${credit.amount.toFixed(2)}","${credit.liters} ${credit.fuelType} @ ₹${credit.rate}","${credit.date}"\n`;
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto p-4">
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