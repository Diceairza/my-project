
import React from 'react';
import { AgedDocument } from '../../types';
import Table from '../../components/ui/Table';
import { getAgingBucket } from './reportUtils';
import { ReceiptIcon } from '../../components/icons/LucideIcons';

interface AgedPayablesReportProps {
  data: AgedDocument[];
  asOfDate: string;
}

const AgedPayablesReport: React.FC<AgedPayablesReportProps> = ({ data, asOfDate }) => {
  const currency = data.length > 0 ? data[0].currency : '';

  const columns = [
    { Header: 'Supplier', accessor: 'customerOrSupplierName' as keyof AgedDocument, className: 'font-medium' },
    { Header: 'Bill #', accessor: 'documentNumber' as keyof AgedDocument },
    { Header: 'Bill Date', accessor: 'issueDate' as keyof AgedDocument, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { Header: 'Due Date', accessor: 'dueDate' as keyof AgedDocument, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { 
      Header: 'Days Overdue', 
      accessor: 'daysOverdue' as keyof AgedDocument, 
      Cell: (days: number) => <span className={days > 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{days > 0 ? days : 'Current'}</span> 
    },
    { Header: 'Aging Bucket', accessor: (row: AgedDocument) => getAgingBucket(row.daysOverdue) },
    { Header: 'Total Amount', accessor: (row: AgedDocument) => `${row.currency} ${row.totalAmount.toFixed(2)}` },
    { Header: 'Amount Due', accessor: (row: AgedDocument) => `${row.currency} ${row.amountDue.toFixed(2)}`, className: 'font-semibold' },
    { Header: 'Status', accessor: 'status' as keyof AgedDocument, Cell: (status: string) => <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">{status}</span>},
  ];
  
  const agingBuckets: { [key: string]: number } = {
    'Current': 0,
    '1-30 Days': 0,
    '31-60 Days': 0,
    '61-90 Days': 0,
    '90+ Days': 0,
  };
  let totalDue = 0;

  data.forEach(item => {
    const bucket = getAgingBucket(item.daysOverdue);
    agingBuckets[bucket] += item.amountDue;
    totalDue += item.amountDue;
  });

  return (
    <div className="space-y-4 p-2">
      <p className="text-xs text-gray-500 text-right mb-2">Aging as of: {asOfDate}</p>
      <h3 className="text-md font-semibold text-gray-700 mb-2">Summary by Aging Bucket:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6 text-center">
        {Object.entries(agingBuckets).map(([bucket, amount]) => (
          <div key={bucket} className="p-3 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500">{bucket}</p>
            <p className="text-lg font-semibold text-primary">
              {currency} {amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
        ))}
      </div>
        <div className="p-3 bg-red-50 rounded-lg shadow-sm text-center mb-6">
          <p className="text-sm text-gray-600">Total Amount Due</p>
          <p className="text-xl font-bold text-red-700">
            {currency} {totalDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
      </div>

      {data.length === 0 ? (
         <div className="text-center py-10 bg-white rounded-lg shadow">
            <ReceiptIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No outstanding payables found for the selected period.</p>
        </div>
      ) : (
        <Table<AgedDocument> columns={columns} data={data} />
      )}
    </div>
  );
};

export default AgedPayablesReport;
