
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './modules/DashboardPage';
import InvoicingPage from './modules/invoicing/InvoicingPage';
import InventoryPage from './modules/inventory/InventoryPage';
import BankingPage from './modules/banking/BankingPage';
import ExpensesPage from './modules/expenses/ExpensesPage';
import TaxationPage from './modules/taxation/TaxationPage';
import PayrollPage from './modules/payroll/PayrollPage';
import ReportingPage from './modules/reporting/ReportingPage';
import ProjectsPage from './modules/projects/ProjectsPage';
import PublicInvoicePaymentPage from './modules/payments/PublicInvoicePaymentPage';
import GeneralLedgerPage from './modules/ledger/GeneralLedgerPage';
import UserManagementPage from './modules/usermanagement/UserManagementPage';
import LoginPage from './modules/auth/LoginPage';
import PlaceholderPage from './modules/PlaceholderPage';
import { APP_MODULES, MOCK_CUSTOMERS, DEFAULT_CURRENCY, DEFAULT_TAX_RATE, AUTH_TOKEN_KEY } from './constants';
import { ModuleInfo, Invoice, Quote, User, PaymentRecord, InvoiceStatus } from './types';
import { authService } from './services/authService';
import { userService } from './services/userService';
import { invoiceService } from './services/invoiceService';
import { quoteService } from './services/quoteService';

interface AuthenticatedLayoutProps {
  currentUser: User;
  onLogout: () => void;
  modules: ModuleInfo[];
}

const AuthenticatedLayout = ({ currentUser, onLogout, modules }: AuthenticatedLayoutProps) => {
  return (
    <div className="flex h-screen bg-neutral-light">
      <Sidebar modules={modules} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial app load
  const [appError, setAppError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setAppError(null);
    try {
      const [loadedUser, loadedUsers, loadedInvoices, loadedQuotes] = await Promise.all([
        authService.getCurrentUserOnAppLoad(),
        userService.getUsers(),
        invoiceService.getInvoices(),
        quoteService.getQuotes()
      ]);
      setCurrentUser(loadedUser);
      setUsers(loadedUsers);
      setInvoices(loadedInvoices);
      setQuotes(loadedQuotes);
    } catch (error: any) {
      console.error("Error loading initial data:", error);
      setAppError(error.message || "Failed to load essential application data. Please try again later.");
      setCurrentUser(null); 
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleLogin = async (userToLogin: User) => { 
    setCurrentUser(userToLogin); 
    const updatedUsers = await userService.getUsers();
    setUsers(updatedUsers);
    // After login, fetch any data that might be user-specific or needs refresh
    const updatedInvoices = await invoiceService.getInvoices();
    setInvoices(updatedInvoices);
    const updatedQuotes = await quoteService.getQuotes();
    setQuotes(updatedQuotes);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    // Clear other app-specific data if necessary
    setInvoices([]);
    setQuotes([]);
    setUsers([]);
  };
  
  const handleRecordInvoicePayment = async (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => {
    try {
      const updatedInvoice = await invoiceService.recordPayment(invoiceId, payment);
      if (updatedInvoice) {
        setInvoices(prevInvoices => 
          prevInvoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv)
        );
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Failed to record payment. Please try again.");
    }
  };

  let determinedVisibleModules: ModuleInfo[];
  if (currentUser?.role === 'Admin') {
    determinedVisibleModules = APP_MODULES;
  } else if (currentUser?.role === 'Payroll Manager') {
    const dashboardModule = APP_MODULES.find(m => m.id === 'dashboard');
    const payrollModule = APP_MODULES.find(m => m.id === 'payroll');
    const tempModules: ModuleInfo[] = [];
    if (dashboardModule) tempModules.push(dashboardModule);
    if (payrollModule) tempModules.push(payrollModule);
    determinedVisibleModules = tempModules;
  } else { // For other roles like Bookkeeper, Sales, Staff
    determinedVisibleModules = APP_MODULES.filter(m => m.id !== 'usermanagement' && m.id !== 'payroll');
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="ml-4 text-lg text-gray-700">Loading Application...</p>
      </div>
    );
  }

  if (appError && !currentUser) { // Show global error if not logged in and initial load failed
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Application Error</h2>
        <p className="text-gray-700 mb-4">{appError}</p>
        <button
          onClick={fetchInitialData}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLogin} />} />

        <Route
          path="/" 
          element={
            currentUser ? (
              <AuthenticatedLayout currentUser={currentUser} onLogout={handleLogout} modules={determinedVisibleModules} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} /> 
          <Route path="dashboard" element={<DashboardPage invoices={invoices} />} />
          <Route
            path="invoicing/*"
            element={
              <InvoicingPage
                initialInvoices={invoices} // Pass initial data for page to manage its own copy or for display
                initialQuotes={quotes}
                onRecordPayment={handleRecordInvoicePayment}
              />
            }
          />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="banking" element={<BankingPage />} />
          <Route path="expenses/*" element={<ExpensesPage />} />
          <Route path="taxation" element={<TaxationPage />} />
           <Route 
            path="payroll/*" 
            element={ 
              currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Payroll Manager') ? 
              <PayrollPage /> : <Navigate to="/dashboard" replace />
            } 
          />
          <Route path="reporting" element={<ReportingPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="ledger/*" element={<GeneralLedgerPage />} />
          <Route
            path="user-management"
            element={
                currentUser && currentUser.role === 'Admin' ? (
                    <UserManagementPage users={users} setUsers={setUsers} currentUser={currentUser} />
                ) : (
                    <Navigate to="/dashboard" replace />
                )
            }
          />
          <Route
            path="pay/:invoiceId"
            element={
              <PublicInvoicePaymentPage
                invoices={invoices}
                setInvoices={setInvoices}
              />
            }
          />

          {/* Placeholder routes for modules not explicitly defined above AND visible to current user */}
          {determinedVisibleModules.filter(module => 
            // Check if the module path is not already handled by an explicit Route above
            ![
              '/dashboard', '/invoicing', '/inventory', '/banking', '/expenses', 
              '/taxation', '/payroll', '/reporting', '/projects', '/ledger', 
              '/user-management', '/pay/' // Note: /pay/ is a pattern, needs careful checking
            ].some(explicitPath => module.path.startsWith(explicitPath) && (module.path.length === explicitPath.length || module.path[explicitPath.length] === '/' || explicitPath.endsWith('/')) ) &&
            module.path !== '/login' // Explicitly exclude login from placeholders
          ).map((module: ModuleInfo) => (
            <Route
              key={module.id}
              path={module.path.substring(1)} 
              element={<PlaceholderPage moduleName={module.name} />}
            />
          ))}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
