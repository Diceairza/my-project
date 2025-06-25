import React from 'react';
import { ProfitAndLossData } from '../../types';
import Card from '../../components/ui/Card';
import { TrendingUpIcon, TrendingDownIcon, CircleDollarSignIcon } from '../../components/icons/LucideIcons';

interface ReportRowProps {
  label: string;
  amount: number;
  currency: string;
  isSubtotal?: boolean;
  isTotal?: boolean;
  isPositive?: boolean; // For coloring profit/loss
  indentLevel?: number;
}

const ReportRow: React.FC<ReportRowProps> = ({ label, amount, currency, isSubtotal, isTotal, isPositive, indentLevel = 0 }) => {
  const textColor = isTotal ? (isPositive ? 'text-emerald-600' : 'text-red-600') : 'text-gray-800';
  const fontWeight = isSubtotal || isTotal ? 'font-semibold' : 'font-normal';
  const paddingLeft = `${indentLevel * 1.5}rem`; // 24px per indent level

  return (
    <div className={`flex justify-between py-2 border-b border-gray-100 last:border-b-0 items-center`} style={{ paddingLeft }}>
      <span className={`text-sm ${fontWeight} ${textColor}`}>{label}</span>
      <span className={`text-sm ${fontWeight} ${textColor}`}>{currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  );
};

interface ProfitAndLossReportProps {
  data: ProfitAndLossData;
}

const ProfitAndLossReport: React.FC<ProfitAndLossReportProps> = ({ data }) => {
  return (
    <div className="space-y-4 p-2">
      <Card title="Income" className="bg-emerald-50">
        <ReportRow label="Total Revenue" amount={data.revenue.total} currency={data.currency} isSubtotal />
        {/* Detailed revenue sources could be listed here if available */}
      </Card>

      <Card title="Cost of Goods Sold (COGS)" className="bg-orange-50">
        <ReportRow label="Total COGS" amount={data.costOfGoodsSold.total} currency={data.currency} isSubtotal />
        <p className="text-xs text-gray-500 pl-6 pt-1">Note: COGS calculation is simplified in this prototype.</p>
      </Card>
      
      <Card title="Gross Profit" className="bg-sky-50">
         <ReportRow label="Gross Profit" amount={data.grossProfit} currency={data.currency} isTotal isPositive={data.grossProfit >= 0} />
      </Card>

      <Card title="Operating Expenses" className="bg-red-50">
        {data.operatingExpenses.categories.sort((a,b) => b.amount - a.amount).map(category => (
          <ReportRow 
            key={category.name} 
            label={category.name} 
            amount={category.amount} 
            currency={data.currency} 
            indentLevel={1}
          />
        ))}
        <ReportRow label="Total Operating Expenses" amount={data.operatingExpenses.total} currency={data.currency} isSubtotal indentLevel={0}/>
      </Card>
      
      <Card title="Operating Profit (EBIT)" className="bg-indigo-50 shadow-lg">
         <ReportRow 
            label="Operating Profit" 
            amount={data.operatingProfit} 
            currency={data.currency} 
            isTotal 
            isPositive={data.operatingProfit >= 0} 
        />
        <p className={`text-sm font-semibold pt-2 text-center ${data.operatingProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {data.operatingProfit >= 0 ? 
                <TrendingUpIcon className="inline w-5 h-5 mr-1"/> : 
                <TrendingDownIcon className="inline w-5 h-5 mr-1"/> 
            }
             This period shows an operating {data.operatingProfit >= 0 ? 'profit' : 'loss'}.
        </p>
      </Card>
      
       <p className="mt-6 text-xs text-gray-500 text-center">
        This is a simplified Profit & Loss statement. It does not include interest, taxes, depreciation, or amortization for Net Profit calculation.
      </p>
    </div>
  );
};

export default ProfitAndLossReport;
