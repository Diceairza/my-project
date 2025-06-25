import React from 'react';
import { TaxSummaryData } from '../../types';

interface TaxSummaryReportProps {
  summaryData: TaxSummaryData;
}

interface ReportRowProps {
  label: string;
  value: string | number;
  isBold?: boolean;
  className?: string;
  currency: string; // Added currency prop
}

const ReportRow: React.FC<ReportRowProps> = ({ label, value, isBold, className, currency }) => (
  <div className={`flex justify-between py-2 border-b border-gray-200 last:border-b-0 ${className}`}>
    <span className={`text-sm ${isBold ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>{label}</span>
    <span className={`text-sm ${isBold ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
      {typeof value === 'number' ? `${currency} ${value.toFixed(2)}` : value}
    </span>
  </div>
);

const TaxSummaryReport: React.FC<TaxSummaryReportProps> = ({ summaryData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Summary Report (Simplified BAS/VAT Return)</h3>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Period: (All Available Data)</h4>
        <h4 className="text-md font-semibold text-gray-700 mb-3">Tax Rate Applied: {summaryData.taxRate}% {summaryData.currency}</h4>

        <div className="space-y-1">
          <ReportRow label="1A. Total Sales (Gross Amount including GST)" value={summaryData.totalSalesGross} currency={summaryData.currency} />
          <ReportRow label="1B. Total Taxable Sales (Net Amount excluding GST)" value={summaryData.totalTaxableSalesNet} currency={summaryData.currency} />
          <ReportRow label="GST Collected on Sales" value={summaryData.gstCollected} isBold className="text-primary-dark" currency={summaryData.currency} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-4">
         <div className="space-y-1">
          <ReportRow label="10A. Total Purchases (Gross Amount including GST)" value={summaryData.totalPurchasesGross} currency={summaryData.currency} />
          <ReportRow label="10B. Total Taxable Purchases (Net Amount excluding GST)" value={summaryData.totalTaxablePurchasesNet} currency={summaryData.currency} />
          <ReportRow label="GST Paid on Purchases" value={summaryData.gstPaid} isBold className="text-red-600" currency={summaryData.currency} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <ReportRow 
            label="Net GST Position" 
            value={summaryData.netGstPosition} 
            isBold 
            className={`text-xl ${summaryData.netGstPosition >= 0 ? 'text-emerald-600' : 'text-red-700'}`} 
            currency={summaryData.currency}
        />
        <p className={`text-sm mt-1 ${summaryData.netGstPosition >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {summaryData.netGstPosition >= 0 ? `Amount payable to tax authority.` : `Amount refundable from tax authority.`}
        </p>
      </div>

       <p className="mt-6 text-xs text-gray-500">
        Disclaimer: This is a simplified report generated from available mock data for demonstration purposes only. 
        It may not reflect all necessary adjustments or meet specific jurisdictional requirements for official tax filing. 
        Always consult with a qualified tax professional for accurate tax advice and reporting.
      </p>
    </div>
  );
};

export default TaxSummaryReport;