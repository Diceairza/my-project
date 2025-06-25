
import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { BankTransaction, BankTransactionStatus, BankTransactionType } from '../../types';
import { EditIcon, Trash2Icon, CheckCircle2Icon, CircleOffIcon, LandmarkIcon } from '../../components/icons/LucideIcons';

interface TransactionListProps {
  transactions: BankTransaction[];
  onEdit: (transaction: BankTransaction) => void;
  onDelete: (transactionId: string) => void;
  onReconcile: (transactionId: string) => void;
  currency: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete, onReconcile, currency }) => {
  
  const getStatusBadge = (status: BankTransactionStatus) => {
    let icon = <CircleOffIcon className="w-4 h-4 mr-1.5" />;
    let textColor = 'text-gray-700';
    let bgColor = 'bg-gray-100';

    switch (status) {
      case BankTransactionStatus.RECONCILED:
        icon = <CheckCircle2Icon className="w-4 h-4 mr-1.5 text-emerald-700" />;
        textColor = 'text-emerald-700';
        bgColor = 'bg-emerald-100';
        break;
      case BankTransactionStatus.UNRECONCILED:
        icon = <CircleOffIcon className="w-4 h-4 mr-1.5 text-red-700" />; 
        textColor = 'text-red-700';
        bgColor = 'bg-red-100';
        break;
      case BankTransactionStatus.PENDING:
        icon = <CircleOffIcon className="w-4 h-4 mr-1.5 text-yellow-700" />;
        textColor = 'text-yellow-700';
        bgColor = 'bg-yellow-100';
        break;
    }
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{icon}{status}</span>;
  };

  const columns = [
    { Header: 'Date', accessor: 'date' as keyof BankTransaction, Cell: (date: string) => new Date(date).toLocaleDateString() },
    { Header: 'Description', accessor: 'description' as keyof BankTransaction, className: 'font-medium' },
    { Header: 'Payee/Source', accessor: 'payeeOrSource' as keyof BankTransaction, Cell: (ps?:string) => ps || 'N/A' },
    { 
      Header: 'Amount', 
      accessor: (row: BankTransaction) => row.amount,
      Cell: (amount: number, row: BankTransaction) => (
        <span className={row.type === BankTransactionType.CREDIT ? 'text-emerald-600' : 'text-red-600'}>
          {row.type === BankTransactionType.CREDIT ? '+' : '-'} {currency} {amount.toFixed(2)}
        </span>
      ) 
    },
    { Header: 'Status', accessor: 'status' as keyof BankTransaction, Cell: (status: BankTransactionStatus) => getStatusBadge(status) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof BankTransaction,
      Cell: (_: any, row: BankTransaction) => (
        <div className="flex space-x-1 items-center">
          {row.status === BankTransactionStatus.UNRECONCILED && (
             <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onReconcile(row.id)} 
                title="Mark as Reconciled"
                className="text-xs px-2 py-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
                Reconcile
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit Transaction">
            <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete Transaction">
            <Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </Button>
        </div>
      ),
    },
  ];

  if (transactions.length === 0) {
    return (
        <div className="text-center py-10">
            <LandmarkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No transactions match the current filters for this account.</p>
            <p className="text-sm text-gray-400">Try adjusting filters or adding new transactions.</p>
        </div>
    );
  }

  return <Table<BankTransaction> columns={columns} data={transactions} />;
};

export default TransactionList;
