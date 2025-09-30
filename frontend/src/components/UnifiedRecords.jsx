import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Calculator, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  IndianRupee,
  Fuel,
  Users,
  Receipt,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { Button } from './ui/button';

const UnifiedRecords = ({ 
  isDarkMode, 
  salesData, 
  creditData, 
  incomeData, 
  expenseData, 
  selectedDate 
}) => {
  // Filter all data for selected date
  const filteredSales = salesData.filter(item => item.date === selectedDate);
  const filteredCredits = creditData.filter(item => item.date === selectedDate);
  const filteredIncome = incomeData.filter(item => item.date === selectedDate);
  const filteredExpenses = expenseData.filter(item => item.date === selectedDate);

  const totalRecords = filteredSales.length + filteredCredits.length + filteredIncome.length + filteredExpenses.length;

  // Export functions
  const exportToPDF = () => {
    // Create PDF content
    const content = generateExportContent();
    
    // Create a temporary element for PDF generation
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #333;">Fuel Pump Records</h1>
        <h2 style="text-align: center; color: #666;">Date: ${selectedDate}</h2>
        <div style="margin: 20px 0;">
          <h3>Summary</h3>
          <p>Total Records: ${totalRecords}</p>
          <p>Fuel Sales: ${filteredSales.length}</p>
          <p>Credit Sales: ${filteredCredits.length}</p>
          <p>Income Records: ${filteredIncome.length}</p>
          <p>Expense Records: ${filteredExpenses.length}</p>
        </div>
        ${content}
      </div>
    `;
    
    // Simple PDF generation using print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(element.innerHTML);
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
      link.setAttribute('download', `fuel_records_${selectedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = () => {
    const textContent = generateTextContent();
    navigator.clipboard.writeText(textContent).then(() => {
      alert('Records copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const generateExportContent = () => {
    let content = '';
    
    if (filteredSales.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #2563eb;">Fuel Sales (' + filteredSales.length + ')</h3>';
      filteredSales.forEach(sale => {
        content += `<p><strong>${sale.nozzle} - ${sale.fuelType}:</strong> ₹${sale.amount.toFixed(2)} (${sale.liters}L @ ₹${sale.rate}/L)</p>`;
      });
      content += '</div>';
    }

    if (filteredCredits.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #ea580c;">Credit Sales (' + filteredCredits.length + ')</h3>';
      filteredCredits.forEach(credit => {
        content += `<p><strong>${credit.customerName}:</strong> ₹${credit.amount.toFixed(2)} (${credit.liters}L ${credit.fuelType} @ ₹${credit.rate}/L)</p>`;
      });
      content += '</div>';
    }

    if (filteredIncome.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #16a34a;">Income (' + filteredIncome.length + ')</h3>';
      filteredIncome.forEach(income => {
        content += `<p><strong>₹${income.amount.toFixed(2)}:</strong> ${income.description}</p>`;
      });
      content += '</div>';
    }

    if (filteredExpenses.length > 0) {
      content += '<div style="margin: 20px 0;"><h3 style="color: #dc2626;">Expenses (' + filteredExpenses.length + ')</h3>';
      filteredExpenses.forEach(expense => {
        content += `<p><strong>₹${expense.amount.toFixed(2)}:</strong> ${expense.description}</p>`;
      });
      content += '</div>';
    }

    return content;
  };

  const generateCSVContent = () => {
    let csv = 'Type,Description,Amount,Details,Date\n';
    
    filteredSales.forEach(sale => {
      csv += `"Fuel Sale","${sale.nozzle} - ${sale.fuelType}","${sale.amount.toFixed(2)}","${sale.liters}L @ ₹${sale.rate}/L","${sale.date}"\n`;
    });

    filteredCredits.forEach(credit => {
      csv += `"Credit Sale","${credit.customerName} - ${credit.vehicleNumber || 'N/A'}","${credit.amount.toFixed(2)}","${credit.liters}L ${credit.fuelType} @ ₹${credit.rate}/L","${credit.date}"\n`;
    });

    filteredIncome.forEach(income => {
      csv += `"Income","${income.description}","${income.amount.toFixed(2)}","","${income.date}"\n`;
    });

    filteredExpenses.forEach(expense => {
      csv += `"Expense","${expense.description}","${expense.amount.toFixed(2)}","","${expense.date}"\n`;
    });

    return csv;
  };

  const generateTextContent = () => {
    let text = `FUEL PUMP RECORDS - ${selectedDate}\n`;
    text += `Total Records: ${totalRecords}\n\n`;
    
    if (filteredSales.length > 0) {
      text += `FUEL SALES (${filteredSales.length}):\n`;
      filteredSales.forEach(sale => {
        text += `• ${sale.nozzle} - ${sale.fuelType}: ₹${sale.amount.toFixed(2)} (${sale.liters}L @ ₹${sale.rate}/L)\n`;
      });
      text += '\n';
    }

    if (filteredCredits.length > 0) {
      text += `CREDIT SALES (${filteredCredits.length}):\n`;
      filteredCredits.forEach(credit => {
        text += `• ${credit.customerName}: ₹${credit.amount.toFixed(2)} (${credit.liters}L ${credit.fuelType} @ ₹${credit.rate}/L)\n`;
      });
      text += '\n';
    }

    if (filteredIncome.length > 0) {
      text += `INCOME (${filteredIncome.length}):\n`;
      filteredIncome.forEach(income => {
        text += `• ₹${income.amount.toFixed(2)}: ${income.description}\n`;
      });
      text += '\n';
    }

    if (filteredExpenses.length > 0) {
      text += `EXPENSES (${filteredExpenses.length}):\n`;
      filteredExpenses.forEach(expense => {
        text += `• ₹${expense.amount.toFixed(2)}: ${expense.description}\n`;
      });
      text += '\n';
    }

    return text;
  };

  const RecordGroup = ({ title, icon: Icon, records, color, renderRecord }) => {
    if (records.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {title} ({records.length})
          </h3>
        </div>
        <div className="space-y-3">
          {records.map(renderRecord)}
        </div>
      </div>
    );
  };

  const renderSalesRecord = (sale) => (
    <div key={sale.id} className={`border rounded-lg p-4 ${
      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-0">
            {sale.nozzle}
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-0">
            {sale.fuelType}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-green-600 font-bold">
          <IndianRupee className="w-4 h-4" />
          <span>{sale.amount.toFixed(2)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Reading:</span>
          <span>{sale.startReading}L → {sale.endReading}L</span>
        </div>
        <div className="flex justify-between">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Liters:</span>
          <span>{sale.liters}L</span>
        </div>
      </div>
    </div>
  );

  const renderCreditRecord = (credit) => (
    <div key={credit.id} className={`border rounded-lg p-4 ${
      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-100 text-orange-800 border-0">
            Credit
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-0">
            {credit.fuelType}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-orange-600 font-bold">
          <IndianRupee className="w-4 h-4" />
          <span>{credit.amount.toFixed(2)}</span>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Customer:</span>
          <span className="font-medium">{credit.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Vehicle:</span>
          <span>{credit.vehicleNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Liters:</span>
          <span>{credit.liters}L</span>
        </div>
      </div>
    </div>
  );

  const renderIncomeRecord = (income) => (
    <div key={income.id} className={`border rounded-lg p-4 ${
      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <Badge className="bg-green-100 text-green-800 border-0">
          Income
        </Badge>
        <div className="flex items-center gap-1 text-green-600 font-bold">
          <IndianRupee className="w-4 h-4" />
          <span>{income.amount.toFixed(2)}</span>
        </div>
      </div>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
        {income.description}
      </p>
    </div>
  );

  const renderExpenseRecord = (expense) => (
    <div key={expense.id} className={`border rounded-lg p-4 ${
      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <Badge className="bg-red-100 text-red-800 border-0">
          Expense
        </Badge>
        <div className="flex items-center gap-1 text-red-600 font-bold">
          <IndianRupee className="w-4 h-4" />
          <span>{expense.amount.toFixed(2)}</span>
        </div>
      </div>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
        {expense.description}
      </p>
    </div>
  );

  return (
    <Card className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
    } shadow-lg mt-6`}>
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          All Records for {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : selectedDate} ({totalRecords})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4">
            {totalRecords === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No records for {selectedDate === new Date().toISOString().split('T')[0] ? 'today' : 'selected date'}</p>
              </div>
            ) : (
              <>
                <RecordGroup
                  title="Fuel Sales"
                  icon={Calculator}
                  records={filteredSales}
                  color="text-blue-600"
                  renderRecord={renderSalesRecord}
                />
                
                <RecordGroup
                  title="Credit Sales"
                  icon={CreditCard}
                  records={filteredCredits}
                  color="text-orange-600"
                  renderRecord={renderCreditRecord}
                />
                
                <RecordGroup
                  title="Income"
                  icon={TrendingUp}
                  records={filteredIncome}
                  color="text-green-600"
                  renderRecord={renderIncomeRecord}
                />
                
                <RecordGroup
                  title="Expenses"
                  icon={TrendingDown}
                  records={filteredExpenses}
                  color="text-red-600"
                  renderRecord={renderExpenseRecord}
                />
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UnifiedRecords;