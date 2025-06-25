import React, { useState, useEffect } from 'react';
import { BankAccount, BankAccountType } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { DEFAULT_CURRENCY } from '../../constants';

interface BankAccountFormProps {
  initialAccount?: BankAccount | null;
  onSave: (account: BankAccount) => void;
  onCancel: () => void;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({ initialAccount, onSave, onCancel }) => {
  const [account, setAccount] = useState<Partial<BankAccount>>(
    initialAccount || {
      accountName: '',
      bankName: '',
      accountType: BankAccountType.BANK_ACCOUNT,
      accountNumberMasked: '',
      currency: DEFAULT_CURRENCY,
      balance: 0,
    }
  );

  useEffect(() => {
    if (initialAccount) {
      setAccount(initialAccount);
    } else {
      // Reset for new account
      setAccount({
        accountName: '',
        bankName: '',
        accountType: BankAccountType.BANK_ACCOUNT,
        accountNumberMasked: '', // Typically, this would be auto-filled or partially user-input for security.
        currency: DEFAULT_CURRENCY,
        balance: 0,
      });
    }
  }, [initialAccount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccount(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.accountName || !account.accountType) {
        alert("Please fill in Account Name and Account Type.");
        return;
    }
    // For masked account number, ensure it's handled appropriately. Here we just pass it.
    // In a real scenario, you might only ask for last 4 digits or handle via secure connection.
    onSave(account as BankAccount);
  };

  const accountTypeOptions = Object.values(BankAccountType).map(type => ({
    value: type,
    label: type,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Account Name*"
        name="accountName"
        value={account.accountName || ''}
        onChange={handleChange}
        required
        placeholder="e.g., Main Business Cheque"
      />
      <Select
        label="Account Type*"
        name="accountType"
        value={account.accountType || BankAccountType.BANK_ACCOUNT}
        onChange={handleChange}
        options={accountTypeOptions}
        required
      />
      {account.accountType !== BankAccountType.PETTY_CASH && (
        <Input
          label="Bank Name"
          name="bankName"
          value={account.bankName || ''}
          onChange={handleChange}
          placeholder="e.g., FNB, Standard Bank"
        />
      )}
      <Input
        label="Account Number (Masked - Optional)"
        name="accountNumberMasked"
        value={account.accountNumberMasked || ''}
        onChange={handleChange}
        placeholder="e.g., ****1234 (Display only)"
      />
       <Input
        label={`Initial Balance (${account.currency || DEFAULT_CURRENCY})`}
        name="balance"
        type="number"
        value={account.balance || 0}
        onChange={handleChange}
        step="0.01"
      />
       <Input
        label="Currency"
        name="currency"
        value={account.currency || DEFAULT_CURRENCY}
        readOnly // Fixed to default currency for now
        className="bg-gray-100"
      />


      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialAccount ? 'Save Changes' : 'Add Account'}
        </Button>
      </div>
    </form>
  );
};

export default BankAccountForm;