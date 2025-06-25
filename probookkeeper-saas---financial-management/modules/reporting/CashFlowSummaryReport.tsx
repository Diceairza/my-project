import React from 'react';
import { CashFlowData } from '../../types';
import Card from '../../components/ui/Card';
import { TrendingUpIcon, TrendingDownIcon, CircleDollarSignIcon } from '../../components/icons/LucideIcons';

interface ReportRowProps {
  label: string;
  amount: number;
  currency: string;
  isTotal?: boolean;
  isPositive?: boolean;
  className?: string;
}

const ReportRow: React.FC<ReportRowProps> = ({ label, amount, currency, isTotal, isPositive, className = '' }) => {
  const textColor = isTotal ? (isPositive ? 'text-emerald-700' : 'text-red-700') : 'text-gray-800';
  const fontWeight = isTotal ? 'font-bold' : 'font-normal';

  return (
    <div className={`flex justify-between py-2 border-b border-gray-100 last:border-b-0 ${className}`}>
      <span className={`text-sm ${fontWeight} ${textColor}`}>{label}</span>
      <span className={`text-sm ${fontWeight} ${textColor}`}>{currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  );
};

interface CashFlowSummaryReportProps {
  data: CashFlowData;
}

const CashFlowSummaryReport: React.FC<CashFlowSummaryReportProps> = ({ data }) => {
  const { currency, totalInflows, totalOutflows, netCashFlow, inflowsByCategory, outflowsByCategory } = data;

  return (
    <div className="space-y-6 p-2">
      <Card title="Cash Inflows" icon={<TrendingUpIcon className="w-5 h-5 text-emerald-600"/>} className="bg-emerald-50">
        {inflowsByCategory.sort((a,b) => b.amount - a.amount).map(item => (
          <ReportRow key={`inflow-${item.category}`} label={item.category} amount={item.amount} currency={currency} />
        ))}
        <ReportRow label="Total Inflows" amount={totalInflows} currency={currency} isTotal isPositive className="pt-2 mt-2 border-t-2 border-emerald-200" />
      </Card>

      <Card title="Cash Outflows" icon={<TrendingDownIcon className="w-5 h-5 text-red-600"/>} className="bg-red-50">
        {outflowsByCategory.sort((a,b) => b.amount - a.amount).map(item => (
          <ReportRow key={`outflow-${item.category}`} label={item.category} amount={item.amount} currency={currency} />
        ))}
        <ReportRow label="Total Outflows" amount={totalOutflows} currency={currency} isTotal isPositive={false} className="pt-2 mt-2 border-t-2 border-red-200" />
      </Card>

      <Card title="Net Cash Flow" icon={<CircleDollarSignIcon className="w-5 h-5 text-indigo-600"/>} className="bg-indigo-50 shadow-lg">
        <ReportRow 
          label="Net Cash Flow" 
          amount={netCashFlow} 
          currency={currency} 
          isTotal 
          isPositive={netCashFlow >= 0} 
          className="text-lg"
        />
        <p className={`text-center pt-2 text-sm font-semibold ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
          {netCashFlow >= 0 ? 'Positive cash flow for the period.' : 'Negative cash flow for the period.'}
        </p>
      </Card>
      <p className="mt-6 text-xs text-gray-500 text-center">
        This summary is based on recorded bank transactions and does not differentiate between operating, investing, or financing activities.
      </p>
    </div>
  );
};

export default CashFlowSummaryReport;
