import React from 'react';
import { BankAccount, BankAccountType } from '../../types';
import { DEFAULT_CURRENCY } from '../../constants';
import { CreditCardIcon, LandmarkIcon, WalletIcon, EditIcon, Trash2Icon } from '../../components/icons/LucideIcons'; 
import Button from '../../components/ui/Button';

interface BankAccountListProps {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string) => void;
  onEditAccount: (account: BankAccount) => void;
  onDeleteAccount: (accountId: string) => void;
}

const BankAccountList: React.FC<BankAccountListProps> = ({ accounts, selectedAccountId, onSelectAccount, onEditAccount, onDeleteAccount }) => {
  
  const getAccountIcon = (type: BankAccountType) => {
    switch (type) {
      case BankAccountType.BANK_ACCOUNT:
        return <LandmarkIcon className="w-6 h-6 text-primary" />;
      case BankAccountType.CREDIT_CARD:
        return <CreditCardIcon className="w-6 h-6 text-red-500" />;
      case BankAccountType.PETTY_CASH:
        return <WalletIcon className="w-6 h-6 text-yellow-500" />; // Added icon for petty cash
      default:
        return <LandmarkIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  if (accounts.length === 0) {
    return <p className="text-gray-500">No bank accounts added yet. Click "Add Bank Account" to get started.</p>;
  }

  return (
    <div className="space-y-3">
      {accounts.map(account => (
        <div
          key={account.id}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-150 ease-in-out
            ${selectedAccountId === account.id ? 'bg-primary-hover shadow-lg ring-2 ring-primary text-white' : 'bg-white hover:shadow-md hover:border-primary-dark'}`}
          onClick={() => onSelectAccount(account.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${selectedAccountId === account.id ? 'bg-white' : 'bg-gray-100'}`}>
                 {getAccountIcon(account.accountType)}
              </div>
              <div>
                <h4 className={`font-semibold ${selectedAccountId === account.id ? 'text-white' : 'text-gray-800'}`}>{account.accountName}</h4>
                <p className={`text-xs ${selectedAccountId === account.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {account.bankName ? `${account.bankName} ` : ''}
                  {account.accountNumberMasked ? `(...${account.accountNumberMasked.slice(-4)})` : account.accountType}
                </p>
              </div>
            </div>
             <div className="flex space-x-1">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); onEditAccount(account); }}
                    aria-label="Edit Account"
                    className={selectedAccountId === account.id ? 'text-white hover:bg-white/20' : 'text-gray-500 hover:text-primary'}
                >
                    <EditIcon className="w-4 h-4"/>
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); onDeleteAccount(account.id); }}
                    aria-label="Delete Account"
                    className={selectedAccountId === account.id ? 'text-white hover:bg-white/20' : 'text-gray-500 hover:text-red-500'}
                >
                    <Trash2Icon className="w-4 h-4"/>
                </Button>
            </div>
          </div>
          <div className="mt-2 text-right">
            <p className={`text-xl font-bold ${selectedAccountId === account.id ? 'text-white' : (account.balance >= 0 ? 'text-emerald-600' : 'text-red-600')}`}>
              {account.currency} {account.balance.toFixed(2)}
            </p>
            {account.lastRefreshed && (
              <p className={`text-xs ${selectedAccountId === account.id ? 'text-blue-200' : 'text-gray-400'}`}>
                As of: {new Date(account.lastRefreshed).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};




export default BankAccountList;