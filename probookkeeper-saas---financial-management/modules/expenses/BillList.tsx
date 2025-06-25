
import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Bill, BillStatus } from '../../types';
import { EditIcon, Trash2Icon, CheckCircle2Icon, ReceiptIcon } from '../../components/icons/LucideIcons';
import { MOCK_SUPPLIERS, DEFAULT_CURRENCY } from '../../constants';

interface BillListProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (billId: string) => void;
  onMarkAsPaid: (billId: string) => void;
}

const BillList: React.FC<BillListProps> = ({ bills, onEdit, onDelete, onMarkAsPaid }) => {
  const getSupplierName = (supplierId: string) => {
    return MOCK_SUPPLIERS.find(s => s.id === supplierId)?.name || 'Unknown Supplier';
  };

  const getStatusBadge = (status: BillStatus) => {
    let bgColor = '';
    let textColor = '';
    switch (status) {
      case BillStatus.PAID:
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-700';
        break;
      case BillStatus.AWAITING_PAYMENT:
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        break;
      case BillStatus.OVERDUE:
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        break;
      case BillStatus.DRAFT:
      case BillStatus.SUBMITTED:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        break;
      case BillStatus.PARTIALLY_PAID:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        break;
      default:
        bgColor = 'bg-gray-200';
        textColor = 'text-gray-800';
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{status}</span>;
  };
  
  const columns = [
    { Header: 'Bill #', accessor: 'billNumber' as keyof Bill, className: 'font-medium' },
    { Header: 'Supplier', accessor: (row: Bill) => getSupplierName(row.supplierId) },
    { Header: 'Bill Date', accessor: 'billDate' as keyof Bill, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { Header: 'Due Date', accessor: 'dueDate' as keyof Bill, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { Header: 'Total', accessor: (row: Bill) => `${row.currency || DEFAULT_CURRENCY} ${row.totalAmount.toFixed(2)}` },
    { Header: 'Status', accessor: 'status' as keyof Bill, Cell: (status: BillStatus) => getStatusBadge(status) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof Bill,
      Cell: (_: any, row: Bill) => (
        <div className="flex space-x-1">
          { (row.status === BillStatus.AWAITING_PAYMENT || row.status === BillStatus.OVERDUE || row.status === BillStatus.PARTIALLY_PAID) && (
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onMarkAsPaid(row.id)} 
                title="Mark as Paid"
                aria-label="Mark as Paid"
            >
                <CheckCircle2Icon className="w-4 h-4 text-emerald-600 hover:text-emerald-800" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit Bill">
            <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete Bill">
            <Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </Button>
        </div>
      ),
    },
  ];

  if (bills.length === 0) {
    return (
        <div className="text-center py-10 bg-white rounded-lg shadow">
            <ReceiptIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No bills match the current filters.</p>
            <p className="text-sm text-gray-400">Try adjusting filters or add a new bill.</p>
        </div>
    );
  }

  return <Table<Bill> columns={columns} data={bills} />;
};

export default BillList;
