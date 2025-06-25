
import { Quote, QuoteStatus } from '../types';
import { MOCK_CUSTOMERS, DEFAULT_CURRENCY, DEFAULT_TAX_RATE } from '../constants'; // Using mock for simulation
import { simulateApiCall, simulateFindApiCall } from './api';

// Initialize with a sample quote if needed, or start empty.
let localQuotes: Quote[] = [
    {
     id: 'qt_1',
     number: 'QT-2024-001',
     customer: MOCK_CUSTOMERS[2],
     issueDate: '2024-07-10',
     expiryDate: '2024-08-10',
     items: [{ id: 'item_3_1', description: 'Software License Annual', quantity: 1, unitPrice: 7500, total: 7500 }],
     subtotal: 7500,
     taxRate: DEFAULT_TAX_RATE,
     taxAmount: 7500 * (DEFAULT_TAX_RATE / 100),
     totalAmount: 7500 + (7500 * (DEFAULT_TAX_RATE / 100)),
     status: QuoteStatus.SENT,
     currency: DEFAULT_CURRENCY
   },
];

export const quoteService = {
  getQuotes: async (): Promise<Quote[]> => {
    return simulateApiCall<Quote[]>(localQuotes);
  },

  getQuoteById: async (id: string): Promise<Quote | null> => {
    return simulateFindApiCall<Quote>(() => localQuotes.find(q => q.id === id));
  },

  createQuote: async (quoteData: Omit<Quote, 'id' | 'number'>): Promise<Quote> => {
    const newQuote: Quote = {
      ...quoteData,
      id: `qt_${Date.now()}`,
      number: `QT-${new Date().getFullYear()}-${String(localQuotes.length + 101).slice(-3)}`,
    };
    localQuotes.push(newQuote);
    return simulateApiCall<Quote>(newQuote);
  },

  updateQuote: async (quoteId: string, quoteData: Partial<Quote>): Promise<Quote | null> => {
    const quoteIndex = localQuotes.findIndex(q => q.id === quoteId);
    if (quoteIndex !== -1) {
      const updatedQuote = { ...localQuotes[quoteIndex], ...quoteData };
      localQuotes[quoteIndex] = updatedQuote;
      return simulateApiCall<Quote>(updatedQuote);
    }
    return simulateApiCall<Quote | null>(null, 300, 0);
  },

  deleteQuote: async (quoteId: string): Promise<{ success: boolean }> => {
    const initialLength = localQuotes.length;
    localQuotes = localQuotes.filter(q => q.id !== quoteId);
    if (localQuotes.length < initialLength) {
      return simulateApiCall<{ success: boolean }>({ success: true });
    }
    return simulateApiCall<{ success: boolean }>({ success: false }, 300, 0);
  },

  convertQuoteToInvoice: async (quoteId: string): Promise<Quote | null> => {
      // This function in a real service might return the new invoice ID or details.
      // Here, we just update the quote status. The invoice creation logic is in InvoicingPage.
      const quoteIndex = localQuotes.findIndex(q => q.id === quoteId);
      if (quoteIndex !== -1) {
          localQuotes[quoteIndex].status = QuoteStatus.CONVERTED;
          return simulateApiCall<Quote>(localQuotes[quoteIndex]);
      }
      return simulateApiCall<Quote | null>(null, 300, 0);
  }
};
