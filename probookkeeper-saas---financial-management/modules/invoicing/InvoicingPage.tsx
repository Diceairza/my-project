
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import InvoiceList from './InvoiceList';
import QuoteList from './QuoteList';
import InvoiceForm from './InvoiceForm';
import QuoteForm from './QuoteForm';
import { Invoice, Quote, InvoiceStatus, QuoteStatus, PaymentRecord } from '../../types';
import { DEFAULT_CURRENCY, DEFAULT_TAX_RATE, MOCK_CUSTOMERS } from '../../constants'; 
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import RecordPaymentModal from './RecordPaymentModal';
import { PlusIcon, FileTextIcon } from '../../components/icons/LucideIcons';
import { invoiceService } from '../../services/invoiceService';
import { quoteService } from '../../services/quoteService';
import Card from '../../components/ui/Card'; // For error display

interface InvoicingPageProps {
  // Props from App.tsx like initialInvoices, initialQuotes are good for initial render
  // But the page should ideally manage its own data lifecycle using services.
  initialInvoices: Invoice[]; 
  initialQuotes: Quote[];
  onRecordPayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => Promise<void>; // Prop for centralized payment logic
}

const InvoicingPage: React.FC<InvoicingPageProps> = ({ initialInvoices, initialQuotes, onRecordPayment }) => {
  const location = useLocation();
  
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  const loadInvoicesAndQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedInvoices, fetchedQuotes] = await Promise.all([
        invoiceService.getInvoices(),
        quoteService.getQuotes()
      ]);
      setInvoices(fetchedInvoices);
      setQuotes(fetchedQuotes);
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Use initial props for the first render, then rely on service calls for updates
    // Or, fetch immediately if initial props are just placeholders or could be stale
    loadInvoicesAndQuotes(); 
  }, [loadInvoicesAndQuotes]);


  const handleSaveInvoice = async (invoice: Invoice, action?: 'save_send') => {
    setIsLoading(true);
    try {
      const finalStatus = action === 'save_send' && invoice.status === InvoiceStatus.DRAFT ? InvoiceStatus.SENT : invoice.status;
      const invoiceToSave = { ...invoice, status: finalStatus };

      if (editingInvoice) {
        await invoiceService.updateInvoice(invoiceToSave.id, invoiceToSave);
      } else {
        await invoiceService.createInvoice(invoiceToSave);
      }
      await loadInvoicesAndQuotes(); // Refresh list
      setEditingInvoice(null);
      setIsInvoiceModalOpen(false);
    } catch (err: any) {
      alert(`Error saving invoice: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuote = async (quote: Quote) => {
     setIsLoading(true);
    try {
      if (editingQuote) {
        await quoteService.updateQuote(quote.id, quote);
      } else {
        await quoteService.createQuote(quote);
      }
      await loadInvoicesAndQuotes(); // Refresh list
      setEditingQuote(null);
      setIsQuoteModalOpen(false);
    } catch (err: any) {
      alert(`Error saving quote: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setIsQuoteModalOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if(window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
        setIsLoading(true);
        try {
            await invoiceService.deleteInvoice(invoiceId);
            await loadInvoicesAndQuotes();
        } catch (err: any) {
            alert(`Error deleting invoice: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if(window.confirm('Are you sure you want to delete this quote?')) {
        setIsLoading(true);
        try {
            await quoteService.deleteQuote(quoteId);
            await loadInvoicesAndQuotes();
        } catch (err: any) {
            alert(`Error deleting quote: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }
  };
  
  const convertQuoteToInvoice = async (quote: Quote) => {
    if(window.confirm(`Convert quote ${quote.number} to an invoice?`)){
        setIsLoading(true);
        try {
            const newInvoiceData: Omit<Invoice, 'id' | 'number' | 'paymentRecords' | 'daysOverdue'> = {
                customer: quote.customer,
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                items: quote.items,
                subtotal: quote.subtotal,
                taxRate: quote.taxRate,
                taxAmount: quote.taxAmount,
                totalAmount: quote.totalAmount,
                status: InvoiceStatus.DRAFT,
                currency: quote.currency,
                notes: quote.notes,
                projectId: (quote as any).projectId, // Assuming quote might have projectId
            };
            await invoiceService.createInvoice(newInvoiceData);
            await quoteService.updateQuote(quote.id, { ...quote, status: QuoteStatus.CONVERTED });
            await loadInvoicesAndQuotes(); // Refresh both lists
        } catch (err:any) {
            alert(`Error converting quote: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleOpenPaymentModal = (invoiceToPay: Invoice) => {
    setPayingInvoice(invoiceToPay);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPayingInvoice(null);
    setIsPaymentModalOpen(false);
  };

  const handleRecordPaymentSubmit = async (payment: Omit<PaymentRecord, 'id'>) => {
    if (payingInvoice) {
      setIsLoading(true);
      try {
        await onRecordPayment(payingInvoice.id, payment); // Call the App.tsx centralized logic
        await loadInvoicesAndQuotes(); // Refresh after App.tsx state is updated
      } catch (err: any) {
        alert(`Error recording payment: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    handleClosePaymentModal();
  };


  const getActiveTab = () => {
    if (location.pathname.includes('/invoicing/quotes')) return 'quotes';
    return 'invoices';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Invoicing & Quoting</h2>
        {getActiveTab() === 'invoices' && (
          <Button onClick={() => { setEditingInvoice(null); setIsInvoiceModalOpen(true); }} leftIcon={<PlusIcon className="w-4 h-4"/>} disabled={isLoading}>
            New Invoice
          </Button>
        )}
        {getActiveTab() === 'quotes' && (
          <Button onClick={() => { setEditingQuote(null); setIsQuoteModalOpen(true); }} leftIcon={<PlusIcon className="w-4 h-4"/>} disabled={isLoading}>
            New Quote
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <NavLink
            to="invoices"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive || location.pathname === '/invoicing' || location.pathname.startsWith('/invoicing/invoices')
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Invoices ({invoices.length})
          </NavLink>
          <NavLink
            to="quotes"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Quotes ({quotes.length})
          </NavLink>
        </nav>
      </div>
      
      {error && (
        <Card title="Error Loading Data" className="bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
            <Button onClick={loadInvoicesAndQuotes} className="mt-2">Try Again</Button>
        </Card>
      )}

      {isLoading && !error && <p className="text-center py-4">Loading data...</p>}

      {!isLoading && !error && (
        <Routes>
            <Route index element={<Navigate to="invoices" replace />} />
            <Route path="invoices" element={<InvoiceList invoices={invoices} onEdit={handleEditInvoice} onDelete={handleDeleteInvoice} onRecordPayment={handleOpenPaymentModal} />} />
            <Route path="quotes" element={<QuoteList quotes={quotes} onEdit={handleEditQuote} onDelete={handleDeleteQuote} onConvertToInvoice={convertQuoteToInvoice} />} />
        </Routes>
      )}


      <Modal isOpen={isInvoiceModalOpen} onClose={() => { setIsInvoiceModalOpen(false); setEditingInvoice(null); }} title={editingInvoice ? "Edit Invoice" : "Create New Invoice"} size="xl">
        <InvoiceForm 
          initialInvoice={editingInvoice} 
          onSave={handleSaveInvoice} 
          onCancel={() => { setIsInvoiceModalOpen(false); setEditingInvoice(null); }} 
        />
      </Modal>

      <Modal isOpen={isQuoteModalOpen} onClose={() => { setIsQuoteModalOpen(false); setEditingQuote(null); }} title={editingQuote ? "Edit Quote" : "Create New Quote"} size="xl">
        <QuoteForm 
          initialQuote={editingQuote} 
          onSave={handleSaveQuote} 
          onCancel={() => { setIsQuoteModalOpen(false); setEditingQuote(null); }} 
        />
      </Modal>

      {payingInvoice && (
        <RecordPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          invoice={payingInvoice}
          onRecordPayment={handleRecordPaymentSubmit}
        />
      )}
    </div>
  );
};

export default InvoicingPage;
