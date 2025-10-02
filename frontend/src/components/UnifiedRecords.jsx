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
  Receipt
} from 'lucide-react';

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
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-4">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Start:</span>
          <span>{sale.startReading}</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>End:</span>
          <span>{sale.endReading}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Litres:</span>
          <span>{sale.liters}</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Rate:</span>
          <span>₹{sale.rate}</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Amount:</span>
          <span>₹{sale.amount.toFixed(2)}</span>
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
        <div className="flex items-center gap-4">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Litres:</span>
          <span>{credit.liters}</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Rate:</span>
          <span>₹{credit.rate}</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Amount:</span>
          <span>₹{credit.amount.toFixed(2)}</span>
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
          <span className="text-sm font-normal">Amount:</span>
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
          <span className="text-sm font-normal">Amount:</span>
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