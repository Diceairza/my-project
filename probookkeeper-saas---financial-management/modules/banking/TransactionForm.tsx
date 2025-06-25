import React, { useState, useEffect } from 'react';
import { BankTransaction, BankTransactionType, BankTransactionStatus } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { DEFAULT_CURRENCY } from '../../constants';

interface TransactionFormProps {
  initialTransaction?: BankTransaction | null;
  onSave: (transaction: BankTransaction) => void;
  onCancel: () => void;
  accountId: string; // To link the transaction to the correct account
}

const TransactionForm: React.FC<TransactionFormProps> = ({ initialTransaction, onSave, onCancel, accountId }) => {
  const [transaction, setTransaction] = useState<Partial<BankTransaction>>(
    initialTransaction || {
      date: new Date().toISOString().split('T')[0],
      description: '',
      payeeOrSource: '',
      amount: 0,
      type: BankTransactionType.DEBIT, // Default to outflow
      status: BankTransactionStatus.UNRECONCILED,
      accountId: accountId,
    }
  );

  useEffect(() => {
    if (initialTransaction) {
      setTransaction(initialTransaction);
    } else {
      setTransaction({
        date: new Date().toISOString().split('T')[0],
        description: '',
        payeeOrSource: '',
        amount: 0,
        type: BankTransactionType.DEBIT,
        status: BankTransactionStatus.UNRECONCILED,
        accountId: accountId,
      });
    }
  }, [initialTransaction, accountId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!transaction.date || !transaction.description || transaction.amount === undefined || transaction.amount <= 0) {
        alert("Please fill in Date, Description, and a valid Amount.");
        return;
    }
    onSave(transaction as BankTransaction);
  };

  const transactionTypeOptions = [
    { value: BankTransactionType.DEBIT, label: 'Outflow (Debit)' },
    { value: BankTransactionType.CREDIT, label: 'Inflow (Credit)' },
  ];

  const transactionStatusOptions = Object.values(BankTransactionStatus).map(status => ({
    value: status,
    label: status,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Date*"
        name="date"
        type="date"
        value={transaction.date || ''}
        onChange={handleChange}
        required
      />
      <Input
        label="Description*"
        name="description"
        value={transaction.description || ''}
        onChange={handleChange}
        required
        placeholder="e.g., Office Rent, Client Payment"
      />
      <Input
        label="Payee / Source"
        name="payeeOrSource"
        value={transaction.payeeOrSource || ''}
        onChange={handleChange}
        placeholder="e.g., Landlord, Customer Name"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
            label={`Amount* (${DEFAULT_CURRENCY})`}
            name="amount"
            type="number"
            value={transaction.amount || ''}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
        />
        <Select
            label="Type*"
            name="type"
            value={transaction.type || BankTransactionType.DEBIT}
            onChange={handleChange}
            options={transactionTypeOptions}
            required
        />
      </div>
       <Select
        label="Status*"
        name="status"
        value={transaction.status || BankTransactionStatus.UNRECONCILED}
        onChange={handleChange}
        options={transactionStatusOptions}
        required
      />
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={transaction.notes || ''}
          onChange={handleChange}
        />
      </div>


      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialTransaction ? 'Save Changes' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;