
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select'; // For date range
import Input from '../../components/ui/Input'; // For custom date range
import { TaxSummaryData, InvoiceStatus, BillStatus, ReportPeriod } from '../../types';
import { DEFAULT_CURRENCY, DEFAULT_TAX_RATE, MOCK_INVOICES, MOCK_BILLS, MOCK_EXPENSES, MOCK_REPORT_PERIODS } from '../../constants';
import TaxSummaryReport from './TaxSummaryReport';
import { CalculatorIcon, PercentIcon } from '../../components/icons/LucideIcons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; helpText?: string }> = ({ title, value, icon, helpText }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-full bg-primary text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {helpText && <p className="text-xs text-gray-400 mt-1">{helpText}</p>}
      </div>
    </div>
  </Card>
);

const TaxationPage: React.FC = () => {
  const [taxSummary, setTaxSummary] = useState<TaxSummaryData | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('all_time');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');


  const calculatedTaxSummary = useMemo((): TaxSummaryData => {
    // Note: Date filtering for mock data is complex and not fully implemented here.
    // This calculation will use all mock data regardless of selectedPeriod for simplicity in this prototype.
    // A real implementation would filter MOCK_INVOICES, MOCK_BILLS, MOCK_EXPENSES by date here.
    
    // Example of how date filtering *could* start (conceptual for this pass):
    // const startDate = selectedPeriod === 'custom' ? new Date(customStartDate) : getStartDateForPeriod(selectedPeriod);
    // const endDate = selectedPeriod === 'custom' ? new Date(customEndDate) : getEndDateForPeriod(selectedPeriod);
    // const filteredInvoices = MOCK_INVOICES.filter(inv => new Date(inv.issueDate) >= startDate && new Date(inv.issueDate) <= endDate);
    // ... and so on for bills and expenses.

    let gstCollected = 0;
    let totalTaxableSalesNet = 0;

    MOCK_INVOICES.forEach(invoice => {
      if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.VOID) {
        gstCollected += invoice.taxAmount;
        totalTaxableSalesNet += invoice.subtotal;
      }
    });

    let gstPaid = 0;
    let totalTaxablePurchasesNet = 0;

    MOCK_BILLS.forEach(bill => {
      if (bill.status === BillStatus.PAID || bill.status === BillStatus.AWAITING_PAYMENT || bill.status === BillStatus.PARTIALLY_PAID) {
        if (bill.taxAmount > 0) {
          gstPaid += bill.taxAmount;
          totalTaxablePurchasesNet += bill.subtotal;
        }
      }
    });

    MOCK_EXPENSES.forEach(expense => {
      if (expense.status === 'Approved' || expense.status === 'Reimbursed') {
        if (expense.taxAmount && expense.taxAmount > 0) {
          gstPaid += expense.taxAmount;
          totalTaxablePurchasesNet += (expense.amount > (expense.taxAmount || 0) ? expense.amount - (expense.taxAmount || 0) : expense.amount);
        }
      }
    });
    
    const totalSalesGross = totalTaxableSalesNet + gstCollected;
    const totalPurchasesGross = totalTaxablePurchasesNet + gstPaid;
    const netGstPosition = gstCollected - gstPaid;

    return {
      totalSalesGross,
      totalTaxableSalesNet,
      gstCollected,
      totalPurchasesGross,
      totalTaxablePurchasesNet,
      gstPaid,
      netGstPosition,
      currency: DEFAULT_CURRENCY,
      taxRate: DEFAULT_TAX_RATE,
      // periodStart: startDate?.toISOString().split('T')[0], // For display in report
      // periodEnd: endDate?.toISOString().split('T')[0],     // For display in report
    };
  }, [selectedPeriod, customStartDate, customEndDate]); // Re-calculate if period changes

  useEffect(() => {
    setTaxSummary(calculatedTaxSummary);
  }, [calculatedTaxSummary]);

  if (!taxSummary) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading tax data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Taxation Overview</h2>
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
        </div>
      </div>
       <p className="text-sm text-gray-500">
            Note: Date period selection is for UI demonstration. Calculations currently use all available mock data.
        </p>


      <Card title="Tax Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Default Currency:</p>
            <p className="text-lg text-gray-800">{DEFAULT_CURRENCY}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Default Tax Rate (VAT):</p>
            <p className="text-lg text-gray-800">{DEFAULT_TAX_RATE}%</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total GST Collected"
          value={`${taxSummary.currency} ${taxSummary.gstCollected.toFixed(2)}`}
          icon={<PercentIcon className="w-6 h-6" />}
          helpText="From valid invoices"
        />
        <StatCard
          title="Total GST Paid"
          value={`${taxSummary.currency} ${taxSummary.gstPaid.toFixed(2)}`}
          icon={<PercentIcon className="w-6 h-6" />}
          helpText="On paid/payable bills & expenses"
        />
        <StatCard
          title="Net GST Position"
          value={`${taxSummary.currency} ${taxSummary.netGstPosition.toFixed(2)}`}
          icon={<CalculatorIcon className="w-6 h-6" />}
          helpText={taxSummary.netGstPosition >= 0 ? "Payable to Tax Authority" : "Refundable from Tax Authority"}
        />
      </div>

      <Card title="Tax Reporting">
        <div className="flex flex-col items-start space-y-4">
          <p className="text-gray-600">
            Generate a summary report for your tax obligations.
          </p>
          <Button
            onClick={() => setShowReport(prev => !prev)}
            leftIcon={<CalculatorIcon className="w-5 h-5" />}
            variant="secondary"
          >
            {showReport ? 'Hide Tax Summary Report' : 'Generate Tax Summary Report'}
          </Button>
          {showReport && taxSummary && (
            <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
              <TaxSummaryReport summaryData={taxSummary} />
            </div>
          )}
        </div>
      </Card>
      
      <Card title="Audit Trail (Conceptual)">
          <p className="text-sm text-gray-600">
            In a complete system, every transaction affecting tax would be logged in an immutable audit trail. This ensures data integrity and compliance for tax audits. This feature is not visually implemented in this prototype.
          </p>
      </Card>
    </div>
  );
};

export default TaxationPage;
