
import { Invoice, InvoiceStatus, PaymentRecord } from '../types';
import { MOCK_INVOICES } from '../constants'; // Using mock for simulation
import { simulateApiCall, simulateFindApiCall } from './api';

let localInvoices = [...MOCK_INVOICES]; // Simulate a mutable data store

export const invoiceService = {
  getInvoices: async (): Promise<Invoice[]> => {
    // Simulate checking for overdue invoices
    const today = new Date();
    const updatedInvoices = localInvoices.map(inv => {
        if (inv.status === InvoiceStatus.SENT || inv.status === InvoiceStatus.PARTIALLY_PAID) {
            const dueDate = new Date(inv.dueDate);
            if (dueDate < today) {
                return { ...inv, status: InvoiceStatus.OVERDUE };
            }
        }
        return inv;
    });
    localInvoices = updatedInvoices;
    return simulateApiCall<Invoice[]>(localInvoices);
  },

  getInvoiceById: async (id: string): Promise<Invoice | null> => {
    return simulateFindApiCall<Invoice>(() => localInvoices.find(inv => inv.id === id));
  },

  createInvoice: async (invoiceData: Omit<Invoice, 'id' | 'number'>): Promise<Invoice> => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      number: `INV-${new Date().getFullYear()}-${String(localInvoices.length + 1001).slice(-3)}`, // More robust mock number
    };
    localInvoices.push(newInvoice);
    return simulateApiCall<Invoice>(newInvoice);
  },

  updateInvoice: async (invoiceId: string, invoiceData: Partial<Invoice>): Promise<Invoice | null> => {
    const invoiceIndex = localInvoices.findIndex(inv => inv.id === invoiceId);
    if (invoiceIndex !== -1) {
      const updatedInvoice = { ...localInvoices[invoiceIndex], ...invoiceData };
      localInvoices[invoiceIndex] = updatedInvoice;
      return simulateApiCall<Invoice>(updatedInvoice);
    }
    return simulateApiCall<Invoice | null>(null, 300, 0);
  },

  deleteInvoice: async (invoiceId: string): Promise<{ success: boolean }> => {
    const initialLength = localInvoices.length;
    localInvoices = localInvoices.filter(inv => inv.id !== invoiceId);
     if (localInvoices.length < initialLength) {
      return simulateApiCall<{ success: boolean }>({ success: true });
    }
    return simulateApiCall<{ success: boolean }>({ success: false }, 300, 0);
  },

  recordPayment: async (invoiceId: string, payment: Omit<PaymentRecord, 'id'>): Promise<Invoice | null> => {
    const invoiceIndex = localInvoices.findIndex(inv => inv.id === invoiceId);
    if (invoiceIndex !== -1) {
      const invoice = localInvoices[invoiceIndex];
      const newPaymentRecords = [...(invoice.paymentRecords || []), { ...payment, id: `pr_${Date.now()}` }];
      const totalPaid = newPaymentRecords.reduce((sum, pr) => sum + pr.amount, 0);
      let newStatus = invoice.status;
      if (totalPaid >= invoice.totalAmount) {
        newStatus = InvoiceStatus.PAID;
      } else if (totalPaid > 0) {
        newStatus = InvoiceStatus.PARTIALLY_PAID;
      }
      const updatedInvoice = { ...invoice, paymentRecords: newPaymentRecords, status: newStatus };
      localInvoices[invoiceIndex] = updatedInvoice;
      return simulateApiCall<Invoice>(updatedInvoice);
    }
    return simulateApiCall<Invoice | null>(null, 300, 0);
  }
};
