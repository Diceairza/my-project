import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { DEFAULT_CURRENCY, MOCK_EXPENSE_CATEGORIES, MOCK_BANK_ACCOUNTS, MOCK_SUPPLIERS, MOCK_PROJECTS } from '../../constants';

interface ExpenseFormProps {
  initialExpense?: Expense | null;
  onSave: (expense: Expense) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialExpense, onSave, onCancel }) => {
  const [expense, setExpense] = useState<Partial<Expense>>(
    initialExpense || {
      date: new Date().toISOString().split('T')[0],
      description: '',
      categoryId: MOCK_EXPENSE_CATEGORIES.length > 0 ? MOCK_EXPENSE_CATEGORIES[0].id : '',
      amount: 0,
      currency: DEFAULT_CURRENCY,
      paymentMethod: PaymentMethod.COMPANY_CARD,
      status: 'Approved', // Default status
      projectId: undefined,
    }
  );

  useEffect(() => {
    if (initialExpense) {
      setExpense(initialExpense);
    } else {
      setExpense({
        date: new Date().toISOString().split('T')[0],
        description: '',
        categoryId: MOCK_EXPENSE_CATEGORIES.length > 0 ? MOCK_EXPENSE_CATEGORIES[0].id : '',
        amount: 0,
        currency: DEFAULT_CURRENCY,
        paymentMethod: PaymentMethod.COMPANY_CARD,
        status: 'Approved',
        projectId: undefined,
      });
    }
  }, [initialExpense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['amount', 'taxAmount'];
    if (name === "projectId") {
        setExpense(prev => ({ ...prev, projectId: value === '' ? undefined : value }));
    } else {
        setExpense(prev => ({
        ...prev,
        [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense.date || !expense.description || !expense.categoryId || expense.amount === undefined || expense.amount <= 0) {
        alert("Please fill in Date, Description, Category, and a valid Amount.");
        return;
    }
    onSave(expense as Expense);
  };

  const categoryOptions = MOCK_EXPENSE_CATEGORIES.map(c => ({ value: c.id, label: c.name }));
  const paymentMethodOptions = Object.values(PaymentMethod).map(pm => ({ value: pm, label: pm }));
  const bankAccountOptions = MOCK_BANK_ACCOUNTS.map(ba => ({ value: ba.id, label: `${ba.accountName} (${ba.currency} ${ba.balance.toFixed(2)})`}));
  bankAccountOptions.unshift({value: '', label: 'None / Not Applicable'});
  
  const supplierOptions = MOCK_SUPPLIERS.map(s => ({ value: s.id, label: s.name }));
  supplierOptions.unshift({value: '', label: 'None / Ad-hoc'});

  const statusOptions = ['Pending', 'Approved', 'Reimbursed', 'Rejected'].map(s => ({ value: s, label: s }));

  const projectOptions = MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name }));
  projectOptions.unshift({ value: '', label: 'None / Not Applicable' });


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Date*" name="date" type="date" value={expense.date || ''} onChange={handleChange} required />
        <Select
            label="Category*"
            name="categoryId"
            value={expense.categoryId || ''}
            onChange={handleChange}
            options={categoryOptions}
            required
        />
      </div>
      
      <Input label="Description*" name="description" value={expense.description || ''} onChange={handleChange} required />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
            label={`Amount* (${expense.currency || DEFAULT_CURRENCY})`} 
            name="amount" type="number" 
            value={expense.amount || ''} 
            onChange={handleChange} 
            min="0.01" step="0.01" 
            required 
        />
        <Input 
            label={`Tax Amount (Optional)`} 
            name="taxAmount" type="number" 
            value={expense.taxAmount || ''} 
            onChange={handleChange} 
            min="0" step="0.01" 
            placeholder='e.g. 15.00'
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
            label="Payment Method"
            name="paymentMethod"
            value={expense.paymentMethod || ''}
            onChange={handleChange}
            options={paymentMethodOptions}
        />
        <Select
            label="Paid From Account (Optional)"
            name="paidFromAccountId"
            value={expense.paidFromAccountId || ''}
            onChange={handleChange}
            options={bankAccountOptions}
        />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Select
            label="Supplier (Optional)"
            name="supplierId"
            value={expense.supplierId || ''}
            onChange={handleChange}
            options={supplierOptions}
        />
        <Select
            label="Status (for Claims)"
            name="status"
            value={expense.status || 'Approved'}
            onChange={handleChange}
            options={statusOptions}
        />
       </div>

      <Select
        label="Link to Project (Optional)"
        name="projectId"
        value={expense.projectId || ''}
        onChange={handleChange}
        options={projectOptions}
        wrapperClassName="md:col-span-1"
      />

      <Input 
        label="Receipt URL (Optional)" 
        name="receiptUrl" 
        type="url" 
        value={expense.receiptUrl || ''} 
        onChange={handleChange} 
        placeholder="https://example.com/receipt.pdf"
      />
      {expense.receiptUrl && 
        <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
            View Current Receipt
        </a>
      }
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={expense.notes || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialExpense ? 'Save Changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;