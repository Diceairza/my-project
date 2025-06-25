import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { JournalEntry, JournalEntryStatus, ChartOfAccount } from '../../types';
import { EditIcon, Trash2Icon, BanIcon as VoidIcon } from '../../components/icons/LucideIcons'; // Using BanIcon as VoidIcon for now
import { DEFAULT_CURRENCY } from '../../constants';

interface JournalEntryListProps {
  journalEntries: JournalEntry[];
  chartOfAccounts: ChartOfAccount[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
  onVoid: (entryId: string) => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ journalEntries, chartOfAccounts, onEdit, onDelete, onVoid }) => {
  
  const getStatusBadge = (status: JournalEntryStatus) => {
    let bgColor = '';
    let textColor = '';
    switch (status) {
      case JournalEntryStatus.POSTED:
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-700';
        break;
      case JournalEntryStatus.DRAFT:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        break;
      case JournalEntryStatus.VOID:
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{status}</span>;
  };

  const columns = [
    { Header: 'Entry #', accessor: 'entryNumber' as keyof JournalEntry, className: 'font-medium' },
    { Header: 'Date', accessor: 'date' as keyof JournalEntry, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { Header: 'Description', accessor: 'description' as keyof JournalEntry },
    { 
      Header: 'Total Debits', 
      accessor: (row: JournalEntry) => `${row.currency || DEFAULT_CURRENCY} ${row.totalDebits.toFixed(2)}`,
      className: 'text-right font-mono'
    },
    { 
      Header: 'Total Credits', 
      accessor: (row: JournalEntry) => `${row.currency || DEFAULT_CURRENCY} ${row.totalCredits.toFixed(2)}`,
      className: 'text-right font-mono'
    },
    { Header: 'Status', accessor: 'status' as keyof JournalEntry, Cell: (status: JournalEntryStatus) => getStatusBadge(status) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof JournalEntry,
      Cell: (_: any, row: JournalEntry) => (
        <div className="flex space-x-1">
          {row.status === JournalEntryStatus.DRAFT && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit Entry" title="Edit Draft">
              <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
            </Button>
          )}
           {row.status === JournalEntryStatus.POSTED && ( // Allow voiding posted entries
            <Button variant="ghost" size="sm" onClick={() => onVoid(row.id)} aria-label="Void Entry" title="Void Entry">
              <VoidIcon className="w-4 h-4 text-orange-600 hover:text-orange-800" />
            </Button>
          )}
          {(row.status === JournalEntryStatus.DRAFT || row.status === JournalEntryStatus.VOID) && ( // Allow deleting draft or voided entries
            <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete Entry" title="Delete Entry">
              <Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" />
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  const sortedJournalEntries = [...journalEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.entryNumber.localeCompare(a.entryNumber));


  return <Table<JournalEntry> columns={columns} data={sortedJournalEntries} />;
};

export default JournalEntryList;