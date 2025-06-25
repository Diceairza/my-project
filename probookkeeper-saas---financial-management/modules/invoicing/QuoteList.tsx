
import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Quote, QuoteStatus } from '../../types';
import { EditIcon, Trash2Icon, FileTextIcon } from '../../components/icons/LucideIcons';

interface QuoteListProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (quoteId: string) => void;
  onConvertToInvoice: (quote: Quote) => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, onEdit, onDelete, onConvertToInvoice }) => {
  const getStatusBadge = (status: QuoteStatus) => {
    let bgColor = '';
    let textColor = '';
    switch (status) {
      case QuoteStatus.ACCEPTED:
      case QuoteStatus.CONVERTED:
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-700';
        break;
      case QuoteStatus.SENT:
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        break;
      case QuoteStatus.REJECTED:
      case QuoteStatus.EXPIRED:
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        break;
      case QuoteStatus.DRAFT:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        break;
      default:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{status}</span>;
  };

  const columns = [
    { Header: 'Number', accessor: 'number' as keyof Quote, className: 'font-medium' },
    { Header: 'Customer', accessor: (row: Quote) => row.customer.name },
    { Header: 'Issue Date', accessor: 'issueDate' as keyof Quote },
    { Header: 'Expiry Date', accessor: 'expiryDate' as keyof Quote },
    { Header: 'Total', accessor: (row: Quote) => `${row.currency} ${row.totalAmount.toFixed(2)}` },
    { Header: 'Status', accessor: 'status' as keyof Quote, Cell: (status: QuoteStatus) => getStatusBadge(status) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof Quote,
      Cell: (_: any, row: Quote) => (
        <div className="flex space-x-1">
          {row.status === QuoteStatus.ACCEPTED || row.status === QuoteStatus.SENT && (
            <Button variant="ghost" size="sm" onClick={() => onConvertToInvoice(row)} title="Convert to Invoice" aria-label="Convert to Invoice">
              <FileTextIcon className="w-4 h-4 text-emerald-600 hover:text-emerald-800" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit"><EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete"><Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" /></Button>
        </div>
      ),
    },
  ];

  return <Table<Quote> columns={columns} data={quotes} />;
};

export default QuoteList;
