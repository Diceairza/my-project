import React from 'react';
import { BalanceSheetData } from '../../types';
import Card from '../../components/ui/Card';
import { ScaleIcon } from '../../components/icons/LucideIcons';


interface ReportRowProps {
  label: string;
  amount: number | undefined;
  currency: string;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indentLevel?: number;
  className?: string;
}

const ReportRow: React.FC<ReportRowProps> = ({ label, amount, currency, isSubtotal, isTotal, indentLevel = 0, className = '' }) => {
  const fontWeight = isSubtotal || isTotal ? 'font-semibold' : 'font-normal';
  const paddingLeft = `${indentLevel * 1.5}rem`;
  const amountStr = amount !== undefined ? `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';

  return (
    <div className={`flex justify-between py-2 border-b border-gray-100 last:border-b-0 items-center ${className}`} style={{ paddingLeft }}>
      <span className={`text-sm ${fontWeight} text-gray-800`}>{label}</span>
      <span className={`text-sm ${fontWeight} text-gray-800`}>{amountStr}</span>
    </div>
  );
};


interface BalanceSheetReportProps {
  data: BalanceSheetData;
}

const BalanceSheetReport: React.FC<BalanceSheetReportProps> = ({ data }) => {
  const { assets, liabilities, equity, currency, asOfDate } = data;

  return (
    <div className="space-y-6 p-2">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Balance Sheet</h3>
        <p className="text-sm text-gray-500">As of {new Date(asOfDate).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets Section */}
        <Card title="Assets" className="bg-emerald-50">
          <ReportRow label="Cash & Cash Equivalents" amount={assets.current.cash} currency={currency} indentLevel={1} />
          <ReportRow label="Accounts Receivable" amount={assets.current.accountsReceivable} currency={currency} indentLevel={1} />
          <ReportRow label="Inventory" amount={assets.current.inventory} currency={currency} indentLevel={1} />
          {/* <ReportRow label="Other Current Assets" amount={assets.current.other} currency={currency} indentLevel={1} /> */}
          <ReportRow label="Total Current Assets" amount={assets.current.total} currency={currency} isSubtotal className="bg-emerald-100 -mx-6 px-6"/>
          
          {/* Placeholder for Non-Current Assets
          <ReportRow label="Property, Plant & Equipment" amount={assets.nonCurrent?.propertyPlantEquipment} currency={currency} indentLevel={1} />
          <ReportRow label="Intangible Assets" amount={assets.nonCurrent?.intangibleAssets} currency={currency} indentLevel={1} />
          <ReportRow label="Total Non-Current Assets" amount={assets.nonCurrent?.total} currency={currency} isSubtotal /> 
          */}
          <ReportRow label="Total Assets" amount={assets.total} currency={currency} isTotal className="bg-emerald-200 -mx-6 px-6 text-lg"/>
        </Card>

        {/* Liabilities & Equity Section */}
        <div className="space-y-6">
          <Card title="Liabilities" className="bg-red-50">
            <ReportRow label="Accounts Payable" amount={liabilities.current.accountsPayable} currency={currency} indentLevel={1} />
            <ReportRow label="Tax Payable (GST/VAT)" amount={liabilities.current.taxPayable} currency={currency} indentLevel={1} />
            <ReportRow label="Credit Card Debt / Short Term Loans" amount={liabilities.current.other} currency={currency} indentLevel={1} />
            <ReportRow label="Total Current Liabilities" amount={liabilities.current.total} currency={currency} isSubtotal className="bg-red-100 -mx-6 px-6" />
            
            {/* Placeholder for Non-Current Liabilities
            <ReportRow label="Long-Term Debt" amount={liabilities.nonCurrent?.longTermDebt} currency={currency} indentLevel={1} />
            <ReportRow label="Total Non-Current Liabilities" amount={liabilities.nonCurrent?.total} currency={currency} isSubtotal />
            */}
            <ReportRow label="Total Liabilities" amount={liabilities.total} currency={currency} isTotal className="bg-red-200 -mx-6 px-6 text-lg"/>
          </Card>

          <Card title="Equity" className="bg-sky-50">
            {/* <ReportRow label="Owner's Capital / Contributed Capital" amount={equity.ownerCapital} currency={currency} indentLevel={1} /> */}
            {/* <ReportRow label="Retained Earnings" amount={equity.retainedEarnings} currency={currency} indentLevel={1} /> */}
             <ReportRow label="Total Equity (Calculated)" amount={equity.total} currency={currency} isTotal className="bg-sky-200 -mx-6 px-6 text-lg"/>
             <p className="text-xs text-gray-500 pl-6 pt-1">Equity = Total Assets - Total Liabilities</p>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6 bg-indigo-50 shadow-lg">
        <div className="flex flex-col md:flex-row justify-around items-center p-4 text-center">
            <div className="mb-2 md:mb-0">
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-xl font-bold text-emerald-700">{currency} {assets.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <ScaleIcon className="w-8 h-8 text-indigo-500 my-2 md:my-0"/>
            <div >
                <p className="text-sm text-gray-600">Total Liabilities + Equity</p>
                <p className="text-xl font-bold text-indigo-700">{currency} {(liabilities.total + equity.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
        </div>
         {(assets.total.toFixed(2) !== (liabilities.total + equity.total).toFixed(2)) && (
            <p className="text-center text-red-600 font-semibold text-sm pt-2">
                Note: Balance sheet does not balance. This indicates a discrepancy in the simplified data or calculations.
            </p>
        )}
      </Card>
       <p className="mt-6 text-xs text-gray-500 text-center">
        This is a simplified Balance Sheet. Detailed equity accounts and non-current items are not fully broken down.
      </p>
    </div>
  );
};

export default BalanceSheetReport;
