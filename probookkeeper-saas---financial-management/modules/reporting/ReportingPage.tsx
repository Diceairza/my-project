
import React, { useState, useMemo } from 'react';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input'; // For custom date range
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button'; // For export buttons
import { 
    ReportPeriod, 
    ProfitAndLossData, 
    BalanceSheetData, 
    CashFlowData, 
    AgedDocument, 
    Invoice, 
    InvoiceStatus, 
    Bill, 
    BillStatus, 
    Expense, 
    BankAccount, 
    BankAccountType, 
    BankTransaction,
    BankTransactionType,
    InventoryItem
} from '../../types';
import { 
    DEFAULT_CURRENCY, 
    MOCK_REPORT_PERIODS, 
    MOCK_INVOICES, 
    MOCK_BILLS, 
    MOCK_EXPENSES, 
    MOCK_BANK_ACCOUNTS, 
    MOCK_BANK_TRANSACTIONS,
    MOCK_INVENTORY_ITEMS,
    MOCK_EXPENSE_CATEGORIES,
    MOCK_SUPPLIERS,
    DEFAULT_TAX_RATE
} from '../../constants';
import { DownloadIcon } from '../../components/icons/LucideIcons';

import ProfitAndLossReport from './ProfitAndLossReport';
import BalanceSheetReport from './BalanceSheetReport';
import CashFlowSummaryReport from './CashFlowSummaryReport';
import AgedReceivablesReport from './AgedReceivablesReport';
import AgedPayablesReport from './AgedPayablesReport';
import { generateAgedReceivables, generateAgedPayables } from './reportUtils';

type ReportType = 'pnl' | 'balance_sheet' | 'cash_flow' | 'aged_receivables' | 'aged_payables';

const reportOptions = [
  { value: 'pnl', label: 'Profit & Loss Statement' },
  { value: 'balance_sheet', label: 'Balance Sheet' },
  { value: 'cash_flow', label: 'Cash Flow Summary' },
  { value: 'aged_receivables', label: 'Aged Receivables' },
  { value: 'aged_payables', label: 'Aged Payables' },
];

// Helper to get start/end dates for periods (simplified)
const getPeriodDates = (period: ReportPeriod, customStart?: string, customEnd?: string): { startDate: Date | null, endDate: Date | null } => {
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize to start of day
    let startDate: Date | null = new Date(today);
    let endDate: Date | null = new Date(today);
    endDate.setHours(23,59,59,999); // Normalize to end of day


    switch (period) {
        case 'this_month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case 'this_quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            startDate = new Date(today.getFullYear(), quarter * 3, 1);
            endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
            break;
        case 'this_year':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        case 'last_month':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
            break;
        // Add more cases for last_quarter, last_year if needed
        case 'custom':
            startDate = customStart ? new Date(customStart) : null;
            endDate = customEnd ? new Date(customEnd) : null;
            if(startDate) startDate.setHours(0,0,0,0);
            if(endDate) endDate.setHours(23,59,59,999);
            break;
        case 'all_time':
        default:
            startDate = null; // Represents all time
            endDate = null;   // Represents all time
            break;
    }
    return { startDate, endDate };
};


const ReportingPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('pnl');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('all_time');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const { startDate: reportStartDate, endDate: reportEndDate } = getPeriodDates(selectedPeriod, customStartDate, customEndDate);
  
  // For Aged reports, we use the end date of the period as the "current date" for aging calculation.
  // If 'all_time' or no end_date for custom, use today.
  const agingAsOfDate = reportEndDate || new Date();


  const profitAndLossData = useMemo((): ProfitAndLossData => {
    // P&L typically uses issue dates for revenue/expenses within the period.
    // This remains complex for mock data without a backend. Will use all data for now.
    let totalRevenue = 0;
    MOCK_INVOICES.forEach(inv => {
      if (inv.status === InvoiceStatus.PAID) { // Ideally filter by inv.issueDate based on reportStartDate/reportEndDate
        totalRevenue += inv.subtotal;
      }
    });

    let totalOperatingExpenses = 0;
    const expenseCategories: { [key: string]: number } = {};

    MOCK_BILLS.forEach(bill => { // Ideally filter by bill.billDate
      if (bill.status === BillStatus.PAID || bill.status === BillStatus.AWAITING_PAYMENT || bill.status === BillStatus.PARTIALLY_PAID) {
        totalOperatingExpenses += bill.subtotal;
         const supplier = MOCK_SUPPLIERS.find(s => s.id === bill.supplierId);
         const categoryName = supplier ? `Purchases - ${supplier.name}` : 'General Purchases';
         expenseCategories[categoryName] = (expenseCategories[categoryName] || 0) + bill.subtotal;
      }
    });

    MOCK_EXPENSES.forEach(exp => { // Ideally filter by exp.date
      if (exp.status === 'Approved' || exp.status === 'Reimbursed') {
        const netAmount = exp.taxAmount ? exp.amount - exp.taxAmount : exp.amount;
        totalOperatingExpenses += netAmount;
        const category = MOCK_EXPENSE_CATEGORIES.find(cat => cat.id === exp.categoryId);
        const categoryName = category ? category.name : 'Uncategorized Expense';
        expenseCategories[categoryName] = (expenseCategories[categoryName] || 0) + netAmount;
      }
    });
    
    const cogsCategory = MOCK_EXPENSE_CATEGORIES.find(c => c.name.toLowerCase().includes('cost of goods sold'));
    const costOfGoodsSold = cogsCategory ? (expenseCategories[cogsCategory.name] || 0) : 0;
    if (cogsCategory && expenseCategories[cogsCategory.name]) {
        delete expenseCategories[cogsCategory.name];
        totalOperatingExpenses -= costOfGoodsSold;
    }

    const grossProfit = totalRevenue - costOfGoodsSold;
    const operatingProfit = grossProfit - totalOperatingExpenses;

    return {
      currency: DEFAULT_CURRENCY,
      revenue: { total: totalRevenue, sources: [] },
      costOfGoodsSold: { total: costOfGoodsSold },
      grossProfit,
      operatingExpenses: { 
        total: totalOperatingExpenses, 
        categories: Object.entries(expenseCategories).map(([name, amount]) => ({ name, amount }))
      },
      operatingProfit,
    };
  }, [MOCK_INVOICES, MOCK_BILLS, MOCK_EXPENSES, reportStartDate, reportEndDate]); // Added date dependencies, though logic isn't fully using them yet for P&L

  const balanceSheetData = useMemo((): BalanceSheetData => {
    // Balance sheet is "as of" a specific date (reportEndDate or today)
    const asOf = agingAsOfDate;
    const cash = MOCK_BANK_ACCOUNTS.filter(acc => acc.accountType === BankAccountType.BANK_ACCOUNT || acc.accountType === BankAccountType.PETTY_CASH)
                                 .reduce((sum, acc) => sum + acc.balance, 0); // Balances are point-in-time
    
    const accountsReceivable = MOCK_INVOICES
                                .filter(inv => new Date(inv.issueDate) <= asOf && (inv.status !== InvoiceStatus.PAID && inv.status !== InvoiceStatus.DRAFT && inv.status !== InvoiceStatus.VOID))
                                .reduce((sum, inv) => sum + (inv.totalAmount - (inv.paymentRecords?.filter(pr => new Date(pr.date) <= asOf).reduce((s, pr) => s + pr.amount, 0) || 0)), 0);

    const inventoryValue = MOCK_INVENTORY_ITEMS.reduce((sum, item) => sum + (item.currentStock * item.purchaseCost), 0); // Snapshot

    const currentAssetsTotal = cash + accountsReceivable + inventoryValue;

    const accountsPayable = MOCK_BILLS
                            .filter(bill => new Date(bill.billDate) <= asOf && (bill.status !== BillStatus.PAID && bill.status !== BillStatus.DRAFT && bill.status !== BillStatus.VOID))
                            .reduce((sum, bill) => sum + (bill.totalAmount - (bill.paidAmount || 0)), 0); // Assuming paidAmount is up to 'asOf'

    const creditCardDebt = MOCK_BANK_ACCOUNTS.filter(acc => acc.accountType === BankAccountType.CREDIT_CARD)
                                .reduce((sum, acc) => sum + (acc.balance < 0 ? Math.abs(acc.balance) : 0), 0); // Snapshot
    
    let gstCollected = 0;
    MOCK_INVOICES.forEach(invoice => {
      if (new Date(invoice.issueDate) <= asOf && invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.VOID) gstCollected += invoice.taxAmount;
    });
    let gstPaidOnPurchases = 0;
    MOCK_BILLS.forEach(bill => {
      if (new Date(bill.billDate) <= asOf && (bill.status === BillStatus.PAID || bill.status === BillStatus.AWAITING_PAYMENT)) gstPaidOnPurchases += bill.taxAmount;
    });
    MOCK_EXPENSES.forEach(expense => {
      if (new Date(expense.date) <= asOf &&(expense.status === 'Approved' || expense.status === 'Reimbursed')) gstPaidOnPurchases += (expense.taxAmount || 0);
    });
    const taxPayable = Math.max(0, gstCollected - gstPaidOnPurchases);

    const currentLiabilitiesTotal = accountsPayable + creditCardDebt + taxPayable;
    const totalAssets = currentAssetsTotal; 
    const totalLiabilities = currentLiabilitiesTotal; 

    return {
      currency: DEFAULT_CURRENCY,
      asOfDate: asOf.toISOString().split('T')[0],
      assets: {
        total: totalAssets,
        current: { total: currentAssetsTotal, cash, accountsReceivable, inventory: inventoryValue },
      },
      liabilities: {
        total: totalLiabilities,
        current: { total: currentLiabilitiesTotal, accountsPayable, taxPayable, other: creditCardDebt },
      },
      equity: {
        total: totalAssets - totalLiabilities, 
      },
    };
  }, [MOCK_INVOICES, MOCK_BILLS, MOCK_EXPENSES, MOCK_BANK_ACCOUNTS, MOCK_INVENTORY_ITEMS, agingAsOfDate]);

  const cashFlowData = useMemo((): CashFlowData => {
    // Cash flow report should be based on transactions within the selected period.
    // This mock version will use all transactions for simplicity.
    let totalInflows = 0;
    let totalOutflows = 0;
    const inflowsByCategory: { [key: string]: number } = {};
    const outflowsByCategory: { [key: string]: number } = {};

    MOCK_BANK_TRANSACTIONS
    // .filter(txn => { // Conceptual date filtering
    //     const txnDate = new Date(txn.date);
    //     return (!reportStartDate || txnDate >= reportStartDate) && (!reportEndDate || txnDate <= reportEndDate);
    // })
    .forEach(txn => {
      const category = txn.category || 'Uncategorized';
      if (txn.type === BankTransactionType.CREDIT) {
        totalInflows += txn.amount;
        inflowsByCategory[category] = (inflowsByCategory[category] || 0) + txn.amount;
      } else {
        totalOutflows += txn.amount;
        outflowsByCategory[category] = (outflowsByCategory[category] || 0) + txn.amount;
      }
    });

    return {
      currency: DEFAULT_CURRENCY,
      totalInflows,
      totalOutflows,
      netCashFlow: totalInflows - totalOutflows,
      inflowsByCategory: Object.entries(inflowsByCategory).map(([category, amount]) => ({ category, amount })),
      outflowsByCategory: Object.entries(outflowsByCategory).map(([category, amount]) => ({ category, amount })),
    };
  }, [MOCK_BANK_TRANSACTIONS, reportStartDate, reportEndDate]); // Added date dependencies
  
  const agedReceivablesData = useMemo(() => {
    const filteredInvoices = MOCK_INVOICES.filter(inv => {
        if (!reportStartDate && !reportEndDate) return true; // All time
        const issueDate = new Date(inv.issueDate);
        if (reportStartDate && issueDate < reportStartDate) return false;
        // For aged receivables, we care about invoices issued *before or within* the period end that are still open.
        if (reportEndDate && issueDate > reportEndDate) return false; 
        return true;
    });
    return generateAgedReceivables(filteredInvoices, agingAsOfDate);
  }, [MOCK_INVOICES, agingAsOfDate, reportStartDate, reportEndDate]);
  
  const agedPayablesData = useMemo(() => {
    const filteredBills = MOCK_BILLS.filter(bill => {
         if (!reportStartDate && !reportEndDate) return true; // All time
        const billDate = new Date(bill.billDate);
        if (reportStartDate && billDate < reportStartDate) return false;
        if (reportEndDate && billDate > reportEndDate) return false;
        return true;
    });
    const rawAgedPayables = generateAgedPayables(filteredBills, agingAsOfDate);
    return rawAgedPayables.map(ap => ({
      ...ap,
      customerOrSupplierName: MOCK_SUPPLIERS.find(s => s.id === ap.customerOrSupplierName)?.name || ap.customerOrSupplierName,
    }));
  }, [MOCK_BILLS, agingAsOfDate, reportStartDate, reportEndDate]);


  const renderReport = () => {
    switch (selectedReportType) {
      case 'pnl':
        return <ProfitAndLossReport data={profitAndLossData} />;
      case 'balance_sheet':
        return <BalanceSheetReport data={balanceSheetData} />;
      case 'cash_flow':
        return <CashFlowSummaryReport data={cashFlowData} />;
      case 'aged_receivables':
        return <AgedReceivablesReport data={agedReceivablesData} asOfDate={agingAsOfDate.toLocaleDateString()} />;
      case 'aged_payables':
        return <AgedPayablesReport data={agedPayablesData} asOfDate={agingAsOfDate.toLocaleDateString()} />;
      default:
        return <p>Select a report type to view.</p>;
    }
  };

  const handleExport = (format: 'PDF' | 'Excel') => {
    alert(`Exporting ${reportOptions.find(opt => opt.value === selectedReportType)?.label} to ${format} is a conceptual feature.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Reporting & Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            label="Report Period"
            options={MOCK_REPORT_PERIODS}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriod)}
            wrapperClassName="mb-0 w-full sm:w-48"
          />
          {selectedPeriod === 'custom' && (
            <>
                <Input type="date" label="Start Date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} wrapperClassName="mb-0 w-full sm:w-auto" />
                <Input type="date" label="End Date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} wrapperClassName="mb-0 w-full sm:w-auto" />
            </>
          )}
           <Select
            label="Report Type"
            options={reportOptions}
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
            wrapperClassName="mb-0 w-full sm:w-64"
          />
        </div>
      </div>
      
       <p className="text-sm text-gray-500">
        Note: Date filtering is applied to Aged Receivables/Payables. Other reports use all available mock data for simplicity.
      </p>

      <Card 
        title={`Report: ${reportOptions.find(opt => opt.value === selectedReportType)?.label || ''}`} 
        className="shadow-xl"
        actions={
            <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} leftIcon={<DownloadIcon className="w-4 h-4"/>}>Export PDF</Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('Excel')} leftIcon={<DownloadIcon className="w-4 h-4"/>}>Export Excel</Button>
            </div>
        }
      >
        {renderReport()}
      </Card>
    </div>
  );
};

export default ReportingPage;
