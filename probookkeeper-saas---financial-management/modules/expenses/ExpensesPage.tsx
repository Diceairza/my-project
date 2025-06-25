
import React, { useState, useMemo } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import BillList from './BillList';
import BillForm from './BillForm';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import { Bill, Expense, BillStatus, ExpenseCategory, PaymentMethod, Supplier } from '../../types';
import { MOCK_BILLS, MOCK_EXPENSES, DEFAULT_CURRENCY, DEFAULT_TAX_RATE, MOCK_SUPPLIERS, MOCK_EXPENSE_CATEGORIES } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select'; // For filters
import { PlusIcon } from '../../components/icons/LucideIcons';

const ExpensesPage: React.FC = () => {
  const location = useLocation();
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Filters
  const [billStatusFilter, setBillStatusFilter] = useState<BillStatus | 'all'>('all');
  const [billSupplierFilter, setBillSupplierFilter] = useState<string | 'all'>('all');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string | 'all'>('all');
  const [expensePaymentMethodFilter, setExpensePaymentMethodFilter] = useState<PaymentMethod | 'all'>('all');


  const filteredBills = useMemo(() => {
    return bills
        .filter(bill => billStatusFilter === 'all' || bill.status === billStatusFilter)
        .filter(bill => billSupplierFilter === 'all' || bill.supplierId === billSupplierFilter);
  }, [bills, billStatusFilter, billSupplierFilter]);

  const filteredExpenses = useMemo(() => {
    return expenses
        .filter(exp => expenseCategoryFilter === 'all' || exp.categoryId === expenseCategoryFilter)
        .filter(exp => expensePaymentMethodFilter === 'all' || exp.paymentMethod === expensePaymentMethodFilter);
  }, [expenses, expenseCategoryFilter, expensePaymentMethodFilter]);


  const handleSaveBill = (bill: Bill) => {
    if (editingBill) {
      setBills(prevBills => prevBills.map(b => b.id === bill.id ? bill : b));
    } else {
      setBills(prevBills => [...prevBills, { ...bill, id: `bill_${Date.now()}` }]);
    }
    setEditingBill(null);
    setIsBillModalOpen(false);
  };

  const handleDeleteBill = (billId: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      setBills(prevBills => prevBills.filter(b => b.id !== billId));
    }
  };
  
  const handleMarkBillAsPaid = (billId: string) => {
    setBills(prevBills => prevBills.map(b => 
        b.id === billId 
        ? { ...b, status: BillStatus.PAID, paidAmount: b.totalAmount, paymentDate: new Date().toISOString().split('T')[0] } 
        : b
    ));
  };


  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      setExpenses(prevExpenses => prevExpenses.map(exp => exp.id === expense.id ? expense : exp));
    } else {
      setExpenses(prevExpenses => [...prevExpenses, { ...expense, id: `exp_${Date.now()}` }]);
    }
    setEditingExpense(null);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
     if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== expenseId));
    }
  };

  const getActiveTab = () => {
    if (location.pathname.includes('/expenses/general')) return 'general';
    return 'bills';
  };

  const billStatusOptions = [{value: 'all', label: 'All Statuses'}, ...Object.values(BillStatus).map(s => ({value: s, label: s}))];
  const supplierOptions = [{value: 'all', label: 'All Suppliers'}, ...MOCK_SUPPLIERS.map(s => ({value: s.id, label: s.name}))];
  const expenseCategoryOptions = [{value: 'all', label: 'All Categories'}, ...MOCK_EXPENSE_CATEGORIES.map(c => ({value: c.id, label: c.name}))];
  const paymentMethodOptions = [{value: 'all', label: 'All Payment Methods'}, ...Object.values(PaymentMethod).map(pm => ({value: pm, label: pm}))];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Bills & Expense Management</h2>
        {getActiveTab() === 'bills' && (
          <Button onClick={() => { setEditingBill(null); setIsBillModalOpen(true); }} leftIcon={<PlusIcon className="w-4 h-4"/>}>
            New Bill
          </Button>
        )}
        {getActiveTab() === 'general' && (
          <Button onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }} leftIcon={<PlusIcon className="w-4 h-4"/>}>
            New Expense
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <NavLink
            to="bills"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive || location.pathname === '/expenses' || location.pathname.startsWith('/expenses/bills')
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Supplier Bills ({filteredBills.length})
          </NavLink>
          <NavLink
            to="general"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            General Expenses ({filteredExpenses.length})
          </NavLink>
        </nav>
      </div>

      {getActiveTab() === 'bills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <Select label="Filter by Status" options={billStatusOptions} value={billStatusFilter} onChange={(e) => setBillStatusFilter(e.target.value as BillStatus | 'all')} wrapperClassName="mb-0" />
            <Select label="Filter by Supplier" options={supplierOptions} value={billSupplierFilter} onChange={(e) => setBillSupplierFilter(e.target.value)} wrapperClassName="mb-0" />
        </div>
      )}
      {getActiveTab() === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <Select label="Filter by Category" options={expenseCategoryOptions} value={expenseCategoryFilter} onChange={(e) => setExpenseCategoryFilter(e.target.value)} wrapperClassName="mb-0" />
            <Select label="Filter by Payment Method" options={paymentMethodOptions} value={expensePaymentMethodFilter} onChange={(e) => setExpensePaymentMethodFilter(e.target.value as PaymentMethod | 'all')} wrapperClassName="mb-0" />
        </div>
      )}


      <Routes>
        <Route index element={<Navigate to="bills" replace />} />
        <Route path="bills" element={<BillList bills={filteredBills} onEdit={(bill) => { setEditingBill(bill); setIsBillModalOpen(true);}} onDelete={handleDeleteBill} onMarkAsPaid={handleMarkBillAsPaid} />} />
        <Route path="general" element={<ExpenseList expenses={filteredExpenses} onEdit={(expense) => { setEditingExpense(expense); setIsExpenseModalOpen(true); }} onDelete={handleDeleteExpense} />} />
      </Routes>

      <Modal 
        isOpen={isBillModalOpen} 
        onClose={() => { setIsBillModalOpen(false); setEditingBill(null); }} 
        title={editingBill ? "Edit Bill" : "Create New Bill"} 
        size="xl"
      >
        <BillForm 
          initialBill={editingBill} 
          onSave={handleSaveBill} 
          onCancel={() => { setIsBillModalOpen(false); setEditingBill(null); }} 
        />
      </Modal>

      <Modal 
        isOpen={isExpenseModalOpen} 
        onClose={() => { setIsExpenseModalOpen(false); setEditingExpense(null); }} 
        title={editingExpense ? "Edit Expense" : "Add New Expense"} 
        size="lg"
      >
        <ExpenseForm 
          initialExpense={editingExpense} 
          onSave={handleSaveExpense} 
          onCancel={() => { setIsExpenseModalOpen(false); setEditingExpense(null); }} 
        />
      </Modal>
    </div>
  );
};

export default ExpensesPage;
