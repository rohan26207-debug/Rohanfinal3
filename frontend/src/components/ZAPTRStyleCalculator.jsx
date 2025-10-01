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
  const exportToPDF = async () => {
    try {
      const content = generateExportContent();
      
      // Create the HTML content for PDF (optimized for small text-based files)
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; margin: 0; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; padding: 15px; border: 1px solid black;">
            <h1 style="margin: 0; font-size: 18px; font-weight: bold;">M.Pump Calc Daily Report</h1>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Date: ${selectedDate} | Time: ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <h2 style="margin: 20px 0 10px 0; font-size: 14px; font-weight: bold;">Summary</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid black;">
            <thead>
              <tr>
                <th style="border: 1px solid black; padding: 5px; font-size: 11px; text-align: left;">Category</th>
                <th style="border: 1px solid black; padding: 5px; font-size: 11px; text-align: right;">Total Litres</th>
                <th style="border: 1px solid black; padding: 5px; font-size: 11px; text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(stats.fuelSalesByType).map(([fuelType, data], index) => 
                `<tr><td style="border: 1px solid black; padding: 4px; font-size: 10px;">${fuelType} Sales</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">${data.liters.toFixed(2)}L</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">₹${data.amount.toFixed(2)}</td></tr>`
              ).join('')}
              <tr><td style="border: 1px solid black; padding: 4px; font-size: 10px;">Credit Sales</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">${stats.creditLiters.toFixed(2)}L</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">₹${stats.creditAmount.toFixed(2)}</td></tr>
              <tr><td style="border: 1px solid black; padding: 4px; font-size: 10px;">Income</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">-</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">₹${stats.otherIncome.toFixed(2)}</td></tr>
              <tr><td style="border: 1px solid black; padding: 4px; font-size: 10px;">Expenses</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">-</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right;">₹${stats.totalExpenses.toFixed(2)}</td></tr>
              <tr><td style="border: 1px solid black; padding: 4px; font-size: 10px; font-weight: bold;">Cash in Hand</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right; font-weight: bold;">${stats.totalLiters.toFixed(2)}L</td><td style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: right; font-weight: bold;">₹${stats.adjustedCashSales.toFixed(2)}</td></tr>
            </tbody>
          </table>
          
          ${content}
          
          <div style="margin-top: 30px; text-align: center; font-size: 10px; border-top: 1px solid black; padding-top: 10px;">
            Page 1 | Generated by M.Pump Calc | ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
          </div>
        </div>
      `;

      // Load jsPDF for pure text-based PDF generation
      if (typeof window.jsPDF === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Generate pure text-based PDF using jsPDF directly
      const { jsPDF } = window.jsPDF;
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      // Set font
      pdf.setFont('helvetica', 'normal');
      
      let yPosition = 20; // Reduced from 40 to 20
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20; // Reduced from 40 to 20
      const contentWidth = pageWidth - (margin * 2);
      
      // Compact Header: Title and Date on same line
      pdf.setFontSize(12); // Reduced from 19 to 12
      pdf.setFont('helvetica', 'bold');
      pdf.text('M.Pump Calc Report', margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${selectedDate}`, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 16; // Reduced from 60 total to 16
      
      // Summary Section (DOUBLED text size)
      pdf.setFontSize(22); // 11 * 2 = 22
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary', margin, yPosition);
      yPosition += 24; // Increased proportionally
      
      // Summary Table Headers (DOUBLED size)
      pdf.setFontSize(20); // 10 * 2 = 20
      pdf.setFont('helvetica', 'bold');
      pdf.text('Category', margin, yPosition);
      pdf.text('Litres', margin + 140, yPosition); // Adjusted for larger text
      pdf.text('Amount', margin + 200, yPosition, { align: 'right' }); 
      yPosition += 20; // Increased proportionally
      
      // No line, save space
      yPosition += 2; // Minimal separator
      
      // Summary Data (DOUBLED size, compact table)
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(18); // 9 * 2 = 18
      
      // Fuel Sales by Type (adjusted for larger text)
      Object.entries(stats.fuelSalesByType).forEach(([fuelType, data]) => {
        pdf.text(`${fuelType}`, margin, yPosition);
        pdf.text(`${data.liters.toFixed(1)}L`, margin + 140, yPosition);
        pdf.text(`₹${data.amount.toFixed(0)}`, margin + 200, yPosition, { align: 'right' });
        yPosition += 16; // Increased spacing for larger text
      });
      
      // Credit Sales
      pdf.text('Credit', margin, yPosition);
      pdf.text(`${stats.creditLiters.toFixed(1)}L`, margin + 140, yPosition);
      pdf.text(`₹${stats.creditAmount.toFixed(0)}`, margin + 200, yPosition, { align: 'right' });
      yPosition += 16;
      
      // Income
      pdf.text('Income', margin, yPosition);
      pdf.text('-', margin + 140, yPosition);
      pdf.text(`₹${stats.otherIncome.toFixed(0)}`, margin + 200, yPosition, { align: 'right' });
      yPosition += 16;
      
      // Expenses
      pdf.text('Expenses', margin, yPosition);
      pdf.text('-', margin + 140, yPosition);
      pdf.text(`₹${stats.totalExpenses.toFixed(0)}`, margin + 200, yPosition, { align: 'right' });
      yPosition += 16;
      
      // Cash in Hand (DOUBLED size, bold)
      pdf.setFontSize(20); // 10 * 2 = 20
      pdf.setFont('helvetica', 'bold');
      pdf.text('Cash Total', margin, yPosition);
      pdf.text(`${stats.totalLiters.toFixed(1)}L`, margin + 140, yPosition);
      pdf.text(`₹${stats.adjustedCashSales.toFixed(0)}`, margin + 200, yPosition, { align: 'right' });
      yPosition += 24; // Increased proportionally
      
      // Add detailed records if available
      const todaySales = salesData.filter(sale => sale.date === selectedDate);
      const todayCredits = creditData.filter(credit => credit.date === selectedDate);
      const todayIncome = incomeData.filter(income => income.date === selectedDate);
      const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);
      
      // Reading Calculation (50% larger text, ultra-compact table)
      if (todaySales.length > 0) {
        yPosition += 10;
        pdf.setFontSize(15); // 10 * 1.5 = 15
        pdf.setFont('helvetica', 'bold');
        pdf.text('Readings', margin, yPosition);
        yPosition += 18;
        
        // More compact table headers (50% larger)
        pdf.setFontSize(12); // 8 * 1.5 = 12
        pdf.text('No', margin, yPosition);
        pdf.text('Nozzle', margin + 18, yPosition); // Tighter columns
        pdf.text('Start', margin + 60, yPosition);
        pdf.text('End', margin + 100, yPosition);
        pdf.text('Rate', margin + 140, yPosition);
        pdf.text('Ltr', margin + 180, yPosition);
        pdf.text('Amt', margin + 215, yPosition);
        yPosition += 12;
        
        yPosition += 3; // Minimal separator
        
        // Ultra-compact data rows (50% larger text)
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12); // 8 * 1.5 = 12
        todaySales.forEach((sale, index) => {
          pdf.text(`${index + 1}`, margin, yPosition);
          pdf.text(`${sale.nozzle}`, margin + 18, yPosition);
          pdf.text(`${sale.startReading}`, margin + 60, yPosition);
          pdf.text(`${sale.endReading}`, margin + 100, yPosition);
          pdf.text(`${sale.rate}`, margin + 140, yPosition);
          pdf.text(`${sale.liters}`, margin + 180, yPosition);
          pdf.text(`${sale.amount.toFixed(0)}`, margin + 215, yPosition);
          yPosition += 11; // Compact but readable
        });
      }
      
      // Save the PDF
      pdf.save(`Report-${selectedDate}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print dialog if PDF generation fails
      const content = generateExportContent();
      
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="text-align: center; margin-bottom: 15px; font-size: 32px; font-weight: bold;">M.Pump Calc Daily Report</h1>
          <h2 style="text-align: center; margin-bottom: 35px; font-size: 22px;">Date: ${selectedDate}</h2>
          ${content}
        </div>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>M.Pump Calc Report - ${selectedDate}</title>
            <style>@media print { body { margin: 0; } }</style>
          </head>
          <body>${element.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      
      alert('PDF generation failed. Please use the print dialog to save as PDF.');
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

  const generateExportContent = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    let content = '';
    
    // Reading Calculation Table
    if (todaySales.length > 0) {
      content += '<h2 style="margin: 15px 0 10px 0; font-size: 12px; font-weight: bold;">Reading Calculation</h2>';
      content += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid black;">';
      content += '<thead>';
      content += '<tr>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Sr.</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: left;">Description</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Start</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">End</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Rate</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Litres</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Amount</th>';
      content += '</tr>';
      content += '</thead>';
      content += '<tbody>';

      let totalLitres = 0;
      let totalAmount = 0;

      todaySales.forEach((sale, index) => {
        totalLitres += parseFloat(sale.liters);
        totalAmount += parseFloat(sale.amount);
        content += '<tr>';
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: center;">${index + 1}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px;">${sale.nozzle} - ${sale.fuelType}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">${sale.startReading}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">${sale.endReading}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">₹${sale.rate}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">${sale.liters}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">₹${sale.amount.toFixed(2)}</td>`;
        content += '</tr>';
      });
      // Total row
      content += '<tr>';
      content += '<td colspan="5" style="border: 1px solid black; padding: 3px; font-size: 9px; font-weight: bold; text-align: right;">Total:</td>';
      content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right; font-weight: bold;">${totalLitres.toFixed(2)}</td>`;
      content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right; font-weight: bold;">₹${totalAmount.toFixed(2)}</td>`;
      content += '</tr>';
      content += '</tbody>';
      content += '</table>';
    }

    // Credit Calculation Table
    if (todayCredits.length > 0) {
      content += '<h2 style="margin: 15px 0 10px 0; font-size: 12px; font-weight: bold;">Credit Calculation</h2>';
      content += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid black;">';
      content += '<thead>';
      content += '<tr>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Sr.</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: left;">Customer</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: left;">Vehicle</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Rate</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Litres</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Amount</th>';
      content += '</tr>';
      content += '</thead>';
      content += '<tbody>';

      let totalCreditLitres = 0;
      let totalCreditAmount = 0;

      todayCredits.forEach((credit, index) => {
        totalCreditLitres += parseFloat(credit.liters);
        totalCreditAmount += parseFloat(credit.amount);
        content += '<tr>';
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: center;">${index + 1}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px;">${credit.customerName}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px;">${credit.vehicleNumber || 'N/A'}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">₹${credit.rate}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">${credit.liters}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">₹${credit.amount.toFixed(2)}</td>`;
        content += '</tr>';
      });

      // Total row
      content += '<tr>';
      content += '<td colspan="4" style="border: 1px solid black; padding: 3px; font-size: 9px; font-weight: bold; text-align: right;">Total:</td>';
      content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right; font-weight: bold;">${totalCreditLitres.toFixed(2)}</td>`;
      content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right; font-weight: bold;">₹${totalCreditAmount.toFixed(2)}</td>`;
      content += '</tr>';

      content += '</tbody>';
      content += '</table>';
    }

    // Extra Calculation (Income & Expenses Combined)
    if (todayIncome.length > 0 || todayExpenses.length > 0) {
      content += '<h2 style="margin: 15px 0 10px 0; font-size: 12px; font-weight: bold;">Extra Calculation</h2>';
      content += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid black;">';
      content += '<thead>';
      content += '<tr>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Sr.</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: left;">Description</th>';
      content += '<th style="border: 1px solid black; padding: 4px; font-size: 10px; text-align: center;">Amount</th>';
      content += '</tr>';
      content += '</thead>';
      content += '<tbody>';

      let extraRowIndex = 1;
      let totalExtraAmount = 0;

      // Add Income entries
      todayIncome.forEach((income) => {
        totalExtraAmount += parseFloat(income.amount);
        content += '<tr>';
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: center;">${extraRowIndex}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px;">${income.description} (Income)</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">₹${income.amount.toFixed(2)}</td>`;
        content += '</tr>';
        extraRowIndex++;
      });

      // Add Expense entries  
      todayExpenses.forEach((expense) => {
        totalExtraAmount -= parseFloat(expense.amount);
        content += '<tr>';
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: center;">${extraRowIndex}</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px;">${expense.description} (Expense)</td>`;
        content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right;">-₹${expense.amount.toFixed(2)}</td>`;
        content += '</tr>';
        extraRowIndex++;
      });

      // Total row
      content += '<tr>';
      content += '<td colspan="2" style="border: 1px solid black; padding: 3px; font-size: 9px; font-weight: bold; text-align: right;">Total:</td>';
      content += `<td style="border: 1px solid black; padding: 3px; font-size: 9px; text-align: right; font-weight: bold;">₹${totalExtraAmount.toFixed(2)}</td>`;
      content += '</tr>';

      content += '</tbody>';
      content += '</table>';
    }

    return content;
  };

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

    let text = '';
    
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