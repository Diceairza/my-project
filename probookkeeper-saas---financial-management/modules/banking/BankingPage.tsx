
import React, { useState, useEffect, useMemo } from 'react';
import { BankAccount, BankTransaction, BankTransactionStatus, BankAccountType, BankTransactionType } from '../../types';
import { MOCK_BANK_ACCOUNTS, MOCK_BANK_TRANSACTIONS, DEFAULT_CURRENCY } from '../../constants';
import BankAccountList from './BankAccountList';
import TransactionList from './TransactionList';
import Modal from '../../components/ui/Modal';
import BankAccountForm from './BankAccountForm';
import TransactionForm from './TransactionForm';
import Button from '../../components/ui/Button';
import { PlusIcon } from '../../components/icons/LucideIcons';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select'; // For filters

const BankingPage: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [transactions, setTransactions] = useState<BankTransaction[]>(MOCK_BANK_TRANSACTIONS);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(MOCK_BANK_ACCOUNTS.length > 0 ? MOCK_BANK_ACCOUNTS[0].id : null);
  
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<BankTransaction | null>(null);

  // Filters for TransactionList
  const [filterType, setFilterType] = useState<BankTransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<BankTransactionStatus | 'all'>('all');


  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
  
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(txn => txn.accountId === selectedAccountId)
      .filter(txn => filterType === 'all' || txn.type === filterType)
      .filter(txn => filterStatus === 'all' || txn.status === filterStatus);
  }, [transactions, selectedAccountId, filterType, filterStatus]);


  const totalInflows = transactions
    .filter(t => t.type === 'Credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOutflows = transactions
    .filter(t => t.type === 'Debit')
    .reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalInflows - totalOutflows;


  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = (account: BankAccount) => {
    if (editingAccount) {
      setAccounts(prev => prev.map(acc => acc.id === account.id ? account : acc));
    } else {
      const newAccount = { ...account, id: `ba_${Date.now()}` };
      setAccounts(prev => [...prev, newAccount]);
      if (!selectedAccountId) { 
        setSelectedAccountId(newAccount.id);
      }
    }
    setIsAccountModalOpen(false);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account and all its transactions? This action cannot be undone.')) {
        setAccounts(prev => prev.filter(acc => acc.id !== accountId));
        setTransactions(prev => prev.filter(txn => txn.accountId !== accountId));
        if (selectedAccountId === accountId) {
            setSelectedAccountId(accounts.length > 1 ? accounts.filter(acc => acc.id !== accountId)[0]?.id : null);
        }
    }
  };


  const handleAddTransaction = () => {
    if (!selectedAccountId) {
        alert("Please select a bank account first.");
        return;
    }
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction: BankTransaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = (transaction: BankTransaction) => {
    const transactionToSave = {
        ...transaction,
        accountId: selectedAccountId!, 
    };

    if (editingTransaction) {
      setTransactions(prev => prev.map(txn => txn.id === transactionToSave.id ? transactionToSave : txn));
    } else {
      setTransactions(prev => [...prev, { ...transactionToSave, id: `txn_${Date.now()}` }]);
    }
    setIsTransactionModalOpen(false);
  };

  const handleDeleteTransaction = (transactionId: string) => {
     if (window.confirm('Are you sure you want to delete this transaction?')) {
        setTransactions(prev => prev.filter(txn => txn.id !== transactionId));
    }
  };

  const handleReconcileTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(txn => 
      txn.id === transactionId ? { ...txn, status: BankTransactionStatus.RECONCILED } : txn
    ));
  };
  
  const typeFilterOptions = [
    { value: 'all', label: 'All Types' },
    { value: BankTransactionType.CREDIT, label: 'Inflow (Credit)' },
    { value: BankTransactionType.DEBIT, label: 'Outflow (Debit)' },
  ];

  const statusFilterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: BankTransactionStatus.UNRECONCILED, label: 'Unreconciled' },
    { value: BankTransactionStatus.RECONCILED, label: 'Reconciled' },
    { value: BankTransactionStatus.PENDING, label: 'Pending' },
  ];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Banking & Cash Flow</h2>
        <Button onClick={handleAddAccount} leftIcon={<PlusIcon className="w-4 h-4" />}>
          Add Bank Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
           <Card title="Bank Accounts" className="h-full">
                <BankAccountList
                    accounts={accounts}
                    selectedAccountId={selectedAccountId}
                    onSelectAccount={setSelectedAccountId}
                    onEditAccount={handleEditAccount}
                    onDeleteAccount={handleDeleteAccount}
                />
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card title="Cash Flow Summary (All Accounts)">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Inflows</p>
                        <p className="text-xl font-semibold text-emerald-600">R {totalInflows.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Outflows</p>
                        <p className="text-xl font-semibold text-red-600">R {totalOutflows.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Net Cash Flow</p>
                        <p className={`text-xl font-semibold ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            R {netCashFlow.toFixed(2)}
                        </p>
                    </div>
                </div>
            </Card>

            {selectedAccount ? (
                <Card 
                    title={`Transactions for ${selectedAccount.accountName}`}
                    actions={
                        <Button onClick={handleAddTransaction} size="sm" leftIcon={<PlusIcon className="w-4 h-4" />}>
                            Add Transaction
                        </Button>
                    }
                >
                    <div className="flex space-x-4 mb-4 pb-4 border-b">
                        <Select
                            label="Filter by Type"
                            options={typeFilterOptions}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as BankTransactionType | 'all')}
                            wrapperClassName="flex-1 mb-0"
                        />
                        <Select
                            label="Filter by Status"
                            options={statusFilterOptions}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as BankTransactionStatus | 'all')}
                            wrapperClassName="flex-1 mb-0"
                        />
                    </div>
                    <TransactionList
                        transactions={filteredTransactions}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                        onReconcile={handleReconcileTransaction}
                        currency={selectedAccount.currency}
                    />
                </Card>
            ) : (
                 <Card className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">Select a bank account to view transactions.</p>
                </Card>
            )}
        </div>
      </div>


      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title={editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
        size="md"
      >
        <BankAccountForm
          initialAccount={editingAccount}
          onSave={handleSaveAccount}
          onCancel={() => setIsAccountModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isTransactionModalOpen && selectedAccountId !== null}
        onClose={() => setIsTransactionModalOpen(false)}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        size="md"
      >
        <TransactionForm
          initialTransaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => setIsTransactionModalOpen(false)}
          accountId={selectedAccountId!} 
        />
      </Modal>
    </div>
  );
};

export default BankingPage;
