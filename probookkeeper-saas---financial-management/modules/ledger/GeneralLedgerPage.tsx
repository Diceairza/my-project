import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import ChartOfAccountsDisplay from './ChartOfAccountsDisplay';
import JournalEntryList from './JournalEntryList';
import JournalEntryForm from './JournalEntryForm';
import { ChartOfAccount, JournalEntry, JournalEntryStatus } from '../../types';
import { MOCK_CHART_OF_ACCOUNTS, MOCK_JOURNAL_ENTRIES } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { PlusIcon } from '../../components/icons/LucideIcons';

const GeneralLedgerPage: React.FC = () => {
  const location = useLocation();
  const [chartOfAccounts] = useState<ChartOfAccount[]>(MOCK_CHART_OF_ACCOUNTS); // CoA is static for now
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);

  const [isJournalEntryModalOpen, setIsJournalEntryModalOpen] = useState(false);
  const [editingJournalEntry, setEditingJournalEntry] = useState<JournalEntry | null>(null);

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    if (editingJournalEntry) {
      setJournalEntries(prevEntries => prevEntries.map(je => je.id === entry.id ? entry : je));
    } else {
      // Basic validation for new entry before adding
      if (entry.totalDebits !== entry.totalCredits) {
          alert("Journal entry is not balanced. Total debits must equal total credits.");
          return; // Prevent saving unbalanced entry
      }
      setJournalEntries(prevEntries => [
        ...prevEntries, 
        { 
          ...entry, 
          id: `je_${Date.now()}`, 
          entryNumber: `JE-${new Date().getFullYear()}-${String(prevEntries.length + 1).padStart(3, '0')}`
        }
      ]);
    }
    setEditingJournalEntry(null);
    setIsJournalEntryModalOpen(false);
  };

  const handleDeleteJournalEntry = (journalEntryId: string) => {
    const entryToDelete = journalEntries.find(je => je.id === journalEntryId);
    if (entryToDelete?.status === JournalEntryStatus.POSTED) {
        if (!window.confirm('This journal entry is POSTED. Deleting it may affect financial records and is generally not recommended. Consider voiding instead. Are you sure you want to delete?')) {
            return;
        }
    } else if (!window.confirm('Are you sure you want to delete this draft journal entry?')) {
        return;
    }
    setJournalEntries(prevEntries => prevEntries.filter(je => je.id !== journalEntryId));
  };
  
  const handleVoidJournalEntry = (journalEntryId: string) => {
     if (window.confirm('Are you sure you want to void this journal entry? This action cannot be undone.')) {
        setJournalEntries(prevEntries => prevEntries.map(je => 
            je.id === journalEntryId ? { ...je, status: JournalEntryStatus.VOID } : je
        ));
    }
  };


  const getActiveTab = () => {
    if (location.pathname.includes('/ledger/journal-entries')) return 'journal-entries';
    return 'chart-of-accounts';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">General Ledger</h2>
        {getActiveTab() === 'journal-entries' && (
          <Button onClick={() => { setEditingJournalEntry(null); setIsJournalEntryModalOpen(true); }} leftIcon={<PlusIcon className="w-4 h-4"/>}>
            New Journal Entry
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <NavLink
            to="chart-of-accounts"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive || location.pathname === '/ledger' 
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Chart of Accounts
          </NavLink>
          <NavLink
            to="journal-entries"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Journal Entries ({journalEntries.filter(je => je.status !== JournalEntryStatus.VOID).length})
          </NavLink>
        </nav>
      </div>

      <Routes>
        <Route index element={<Navigate to="chart-of-accounts" replace />} />
        <Route path="chart-of-accounts" element={<ChartOfAccountsDisplay accounts={chartOfAccounts} />} />
        <Route path="journal-entries" element={
            <JournalEntryList 
                journalEntries={journalEntries} 
                onEdit={(entry) => { setEditingJournalEntry(entry); setIsJournalEntryModalOpen(true);}} 
                onDelete={handleDeleteJournalEntry}
                onVoid={handleVoidJournalEntry}
                chartOfAccounts={chartOfAccounts}
            />} 
        />
      </Routes>

      <Modal 
        isOpen={isJournalEntryModalOpen} 
        onClose={() => { setIsJournalEntryModalOpen(false); setEditingJournalEntry(null); }} 
        title={editingJournalEntry ? "Edit Journal Entry" : "Create New Journal Entry"} 
        size="xl"
      >
        <JournalEntryForm 
          initialEntry={editingJournalEntry} 
          chartOfAccounts={chartOfAccounts}
          onSave={handleSaveJournalEntry} 
          onCancel={() => { setIsJournalEntryModalOpen(false); setEditingJournalEntry(null); }} 
        />
      </Modal>
    </div>
  );
};

export default GeneralLedgerPage;