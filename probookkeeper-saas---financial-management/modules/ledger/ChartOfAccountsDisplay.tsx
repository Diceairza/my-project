import React from 'react';
import Table from '../../components/ui/Table';
import { ChartOfAccount, AccountType } from '../../types';
import { DEFAULT_CURRENCY } from '../../constants';

interface ChartOfAccountsDisplayProps {
  accounts: ChartOfAccount[];
}

const ChartOfAccountsDisplay: React.FC<ChartOfAccountsDisplayProps> = ({ accounts }) => {
  const getAccountTypeName = (type: AccountType) => {
    // Could add more user-friendly names if needed
    return type;
  };
  
  // Simple sort: by account number
  const sortedAccounts = [...accounts].sort((a, b) => a.accountNumber.localeCompare(b.accountNumber));


  const columns = [
    { Header: 'Acc. Number', accessor: 'accountNumber' as keyof ChartOfAccount, className: 'font-mono' },
    { Header: 'Account Name', accessor: 'name' as keyof ChartOfAccount, className: 'font-medium' },
    { Header: 'Type', accessor: (row: ChartOfAccount) => getAccountTypeName(row.type) },
    { Header: 'Description', accessor: 'description' as keyof ChartOfAccount, Cell: (desc?: string) => desc || <span className="text-gray-400">N/A</span> },
    { 
      Header: 'Balance', 
      accessor: (row: ChartOfAccount) => row.balance,
      Cell: (balance?: number, row?: ChartOfAccount) => 
        balance !== undefined 
          ? `${row?.currency || DEFAULT_CURRENCY} ${balance.toFixed(2)}` 
          : <span className="text-gray-400">N/A</span>,
      className: 'text-right font-mono'
    },
    // { Header: 'System Acc.', accessor: 'isSystemAccount' as keyof ChartOfAccount, Cell: (isSystem?: boolean) => isSystem ? 'Yes' : 'No' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Chart of Accounts</h3>
      <p className="text-sm text-gray-500 mb-4">
        This is the list of all financial accounts in your company's general ledger. Balances shown are from mock data and are not dynamically updated in this prototype.
      </p>
      <Table<ChartOfAccount> columns={columns} data={sortedAccounts} />
       <p className="mt-4 text-xs text-gray-500">
        Note: Adding, editing, or deleting accounts from the Chart of Accounts is typically an administrative function and is not implemented in this UI prototype.
      </p>
    </div>
  );
};

export default ChartOfAccountsDisplay;