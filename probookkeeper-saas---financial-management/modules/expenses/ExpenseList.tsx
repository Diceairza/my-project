
import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Expense, PaymentMethod } from '../../types';
import { EditIcon, Trash2Icon, LinkIcon, ReceiptIcon } from '../../components/icons/LucideIcons';
import { MOCK_EXPENSE_CATEGORIES, DEFAULT_CURRENCY, MOCK_BANK_ACCOUNTS, MOCK_SUPPLIERS } from '../../constants';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const getCategoryName = (categoryId: string) => {
    return MOCK_EXPENSE_CATEGORIES.find(c => c.id === categoryId)?.name || 'Unknown Category';
  };

  const getPaidFromAccountName = (accountId?: string) => {
    if (!accountId) return 'N/A';
    return MOCK_BANK_ACCOUNTS.find(acc => acc.id === accountId)?.accountName || 'Unknown Account';
  };
  
  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return 'N/A';
    return MOCK_SUPPLIERS.find(s => s.id === supplierId)?.name || 'N/A';
  };

  const columns = [
    { Header: 'Date', accessor: 'date' as keyof Expense, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { Header: 'Description', accessor: 'description' as keyof Expense, className: 'font-medium' },
    { Header: 'Category', accessor: (row: Expense) => getCategoryName(row.categoryId) },
    { Header: 'Amount', accessor: (row: Expense) => `${row.currency || DEFAULT_CURRENCY} ${row.amount.toFixed(2)}` },
    { Header: 'Supplier', accessor: (row: Expense) => getSupplierName(row.supplierId) },
    { Header: 'Payment Method', accessor: 'paymentMethod' as keyof Expense, Cell: (pm?: PaymentMethod) => pm || 'N/A' },
    // { Header: 'Paid From', accessor: (row: Expense) => getPaidFromAccountName(row.paidFromAccountId) },
    { Header: 'Status', accessor: 'status' as keyof Expense, Cell: (status?: string) => status || 'N/A'},
    { 
      Header: 'Receipt', 
      accessor: 'receiptUrl' as keyof Expense, 
      Cell: (url?: string) => url ? 
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center" title="View Receipt">
          <LinkIcon className="w-4 h-4 mr-1"/> View
        </a> : <span className="text-gray-400">None</span> 
    },
    {
      Header: 'Actions',
      accessor: 'id' as keyof Expense,
      Cell: (_: any, row: Expense) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit Expense">
            <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete Expense">
            <Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </Button>
        </div>
      ),
    },
  ];

  if (expenses.length === 0) {
    return (
        <div className="text-center py-10 bg-white rounded-lg shadow">
            <ReceiptIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No expenses match the current filters.</p>
            <p className="text-sm text-gray-400">Try adjusting filters or add a new expense.</p>
        </div>
    );
  }

  return <Table<Expense> columns={columns} data={expenses} />;
};

export default ExpenseList;
