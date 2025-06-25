import React, { useState, useEffect, useCallback } from 'react';
import { JournalEntry, JournalEntryLine, ChartOfAccount, AccountType, JournalEntryStatus } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { PlusIcon, Trash2Icon } from '../../components/icons/LucideIcons';
import { DEFAULT_CURRENCY } from '../../constants';

interface JournalEntryFormProps {
  initialEntry?: JournalEntry | null;
  chartOfAccounts: ChartOfAccount[];
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const newEmptyJournalLine = (accountId: string = ''): JournalEntryLine => ({
  id: `jel_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  accountId: accountId,
  debit: 0,
  credit: 0,
  description: '',
});

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ initialEntry, chartOfAccounts, onSave, onCancel }) => {
  const [entry, setEntry] = useState<Partial<JournalEntry>>(
    initialEntry || {
      date: new Date().toISOString().split('T')[0],
      description: '',
      lines: [newEmptyJournalLine(chartOfAccounts[0]?.id || ''), newEmptyJournalLine(chartOfAccounts[1]?.id || '')], // Start with two lines
      status: JournalEntryStatus.DRAFT,
      currency: DEFAULT_CURRENCY,
      totalDebits: 0,
      totalCredits: 0,
    }
  );

  const calculateTotals = useCallback(() => {
    const lines = entry.lines || [];
    const totalDebits = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    const totalCredits = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
    setEntry(prev => ({ ...prev, totalDebits, totalCredits }));
  }, [entry.lines]);

  useEffect(() => {
    if (initialEntry) {
      setEntry(initialEntry);
    } else {
      setEntry({
        date: new Date().toISOString().split('T')[0],
        description: '',
        lines: [
            newEmptyJournalLine(chartOfAccounts.find(acc => acc.type === AccountType.ASSET)?.id || chartOfAccounts[0]?.id || ''), 
            newEmptyJournalLine(chartOfAccounts.find(acc => acc.type === AccountType.INCOME)?.id || chartOfAccounts[1]?.id || '')
        ].filter(l => l.accountId), // Ensure accounts exist
        status: JournalEntryStatus.DRAFT,
        currency: DEFAULT_CURRENCY,
        totalDebits: 0,
        totalCredits: 0,
      });
    }
  }, [initialEntry, chartOfAccounts]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleLineChange = (index: number, field: keyof JournalEntryLine, value: string | number) => {
    const newLines = [...(entry.lines || [])];
    const lineToUpdate = { ...newLines[index] };

    if (field === 'debit') {
      lineToUpdate.debit = parseFloat(value as string) || 0;
      if (lineToUpdate.debit > 0) lineToUpdate.credit = 0; // Ensure only one has value
    } else if (field === 'credit') {
      lineToUpdate.credit = parseFloat(value as string) || 0;
      if (lineToUpdate.credit > 0) lineToUpdate.debit = 0; // Ensure only one has value
    } else {
      (lineToUpdate[field] as any) = value;
    }
    
    newLines[index] = lineToUpdate;
    setEntry(prev => ({ ...prev, lines: newLines }));
  };

  const addLine = () => {
    setEntry(prev => ({ ...prev, lines: [...(prev.lines || []), newEmptyJournalLine(chartOfAccounts[0]?.id || '')] }));
  };

  const removeLine = (index: number) => {
    if ((entry.lines || []).length <= 2) {
      alert("A journal entry must have at least two lines.");
      return;
    }
    setEntry(prev => ({ ...prev, lines: (prev.lines || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = entry.lines || [];
    if (!entry.date || !entry.description || lines.length < 2) {
      alert("Please fill Date, Description, and ensure at least two journal lines.");
      return;
    }
    if ((entry.totalDebits || 0) !== (entry.totalCredits || 0)) {
      alert("Journal entry is not balanced. Total debits must equal total credits.");
      return;
    }
    if (lines.some(line => !line.accountId)) {
      alert("Please select an account for all journal lines.");
      return;
    }
    if (lines.some(line => line.debit === 0 && line.credit === 0)) {
      alert("All journal lines must have a debit or credit amount.");
      return;
    }

    onSave(entry as JournalEntry);
  };
  
  const accountOptions = chartOfAccounts
    .filter(acc => !acc.isSystemAccount || (acc.name === 'VAT Payable' || acc.name.includes('Cash') || acc.name.includes('Bank'))) // Allow some system accounts like cash/bank/vat
    .sort((a,b) => a.accountNumber.localeCompare(b.accountNumber))
    .map(acc => ({ 
        value: acc.id, 
        label: `${acc.accountNumber} - ${acc.name} (${acc.type})` 
    }));
  
  const statusOptions = Object.values(JournalEntryStatus).map(s => ({ value: s, label: s}));

  const isBalanced = (entry.totalDebits || 0) === (entry.totalCredits || 0) && (entry.totalDebits || 0) > 0;


  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Entry Number" name="entryNumber" value={entry.entryNumber || 'JE-YYYY-XXX (Auto)'} readOnly className="bg-gray-100" />
        <Input label="Date*" name="date" type="date" value={entry.date || ''} onChange={handleChange} required />
        <Select
            label="Status*"
            name="status"
            value={entry.status || JournalEntryStatus.DRAFT}
            onChange={handleChange}
            options={statusOptions}
            required
            disabled={initialEntry?.status === JournalEntryStatus.POSTED || initialEntry?.status === JournalEntryStatus.VOID}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={entry.description || ''}
          onChange={handleChange}
          required
        />
      </div>


      <h3 className="text-lg font-medium text-gray-900 border-t pt-4">Journal Lines</h3>
      {(entry.lines || []).map((line, index) => (
        <div key={line.id} className="grid grid-cols-12 gap-x-3 gap-y-1 items-end p-3 border rounded-md bg-gray-50 relative">
           <div className="col-span-12 md:col-span-4">
            <Select
              label={index === 0 ? "Account*" : undefined}
              value={line.accountId}
              onChange={(e) => handleLineChange(index, 'accountId', e.target.value)}
              options={accountOptions}
              className="mt-1 text-xs"
              required
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <Input 
                label={index === 0 ? "Line Description" : undefined} 
                name="lineDescription" 
                value={line.description || ''} 
                onChange={(e) => handleLineChange(index, 'description', e.target.value)} 
                className="mt-1 text-xs"
                placeholder="Optional line item note"
            />
          </div>
          <div className="col-span-6 md:col-span-2">
             <Input 
                label={index === 0 ? "Debit" : undefined} 
                type="number" 
                value={line.debit === 0 && line.credit > 0 ? '' : line.debit} // Show empty if credit has value
                onChange={(e) => handleLineChange(index, 'debit', parseFloat(e.target.value))} 
                min="0" step="0.01" className="mt-1 text-xs text-right" 
                disabled={line.credit > 0}
             />
          </div>
          <div className="col-span-6 md:col-span-2">
            <Input 
                label={index === 0 ? "Credit" : undefined} 
                type="number" 
                value={line.credit === 0 && line.debit > 0 ? '' : line.credit} // Show empty if debit has value
                onChange={(e) => handleLineChange(index, 'credit', parseFloat(e.target.value))} 
                min="0" step="0.01" 
                className="mt-1 text-xs text-right" 
                disabled={line.debit > 0}
            />
          </div>
          <div className="col-span-12 md:col-span-1 flex justify-end items-center md:items-end h-full">
            {(entry.lines || []).length > 2 && (
              <Button type="button" variant="danger" size="sm" onClick={() => removeLine(index)} aria-label="Remove line" className="mt-1 md:mt-0 px-2 py-1 self-center md:self-end">
                <Trash2Icon className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addLine} leftIcon={<PlusIcon className="w-4 h-4" />}>
        Add Line
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
        <div className="col-span-1 md:col-start-2 text-right space-y-1">
            <div className="flex justify-end items-center">
                <p className="text-gray-600 mr-2">Total Debits:</p>
                <span className="font-semibold text-gray-800 w-32 text-right">{entry.currency} {(entry.totalDebits || 0).toFixed(2)}</span>
            </div>
             <div className="flex justify-end items-center">
                <p className="text-gray-600 mr-2">Total Credits:</p>
                <span className="font-semibold text-gray-800 w-32 text-right">{entry.currency} {(entry.totalCredits || 0).toFixed(2)}</span>
            </div>
            <div className={`flex justify-end items-center mt-1 pt-1 border-t ${isBalanced ? 'text-emerald-600' : 'text-red-600'}`}>
                <p className="font-bold mr-2">Balance:</p>
                <span className="font-bold w-32 text-right">{entry.currency} {((entry.totalDebits || 0) - (entry.totalCredits || 0)).toFixed(2)}</span>
            </div>
            {!isBalanced && (entry.totalDebits || 0) > 0 && (entry.totalCredits || 0) > 0 && (
                 <p className="text-xs text-red-500 text-right mt-1">Entry is not balanced.</p>
            )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
            type="submit" 
            variant="primary" 
            disabled={!isBalanced || entry.status === JournalEntryStatus.POSTED || entry.status === JournalEntryStatus.VOID}
            title={!isBalanced ? "Journal must be balanced to save" : (entry.status === JournalEntryStatus.POSTED || entry.status === JournalEntryStatus.VOID ? "Entry is already posted/voided" : "Save Journal Entry")}
        >
          {initialEntry ? (entry.status === JournalEntryStatus.DRAFT ? 'Save Draft Changes' : 'Entry Posted/Voided') : 'Save Journal Entry'}
        </Button>
      </div>
    </form>
  );
};

export default JournalEntryForm;