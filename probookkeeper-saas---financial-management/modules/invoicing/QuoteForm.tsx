
import React, { useState, useEffect, useCallback } from 'react';
import { Quote, LineItem, Customer, QuoteStatus } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { PlusIcon, Trash2Icon } from '../../components/icons/LucideIcons';
import { DEFAULT_CURRENCY, DEFAULT_TAX_RATE, MOCK_CUSTOMERS, MOCK_ITEMS_CATALOG } from '../../constants';

interface QuoteFormProps {
  initialQuote?: Quote | null;
  onSave: (quote: Quote) => void;
  onCancel: () => void;
}

const newEmptyLineItem = (): LineItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  description: '',
  quantity: 1,
  unitPrice: 0,
  total: 0,
});

const QuoteForm: React.FC<QuoteFormProps> = ({ initialQuote, onSave, onCancel }) => {
  const [quote, setQuote] = useState<Partial<Quote>>(
    initialQuote || {
      number: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random()*1000)).padStart(3, '0')}`,
      customer: MOCK_CUSTOMERS[0],
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expires in 30 days
      items: [newEmptyLineItem()],
      status: QuoteStatus.DRAFT,
      currency: DEFAULT_CURRENCY, // ZAR
      taxRate: DEFAULT_TAX_RATE, // 15%
    }
  );

  const calculateTotals = useCallback(() => {
    const items = quote.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = quote.taxRate || DEFAULT_TAX_RATE;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;
    setQuote(prev => ({ ...prev, subtotal, taxAmount, totalAmount }));
  }, [quote.items, quote.taxRate]);
  
  useEffect(() => {
    if (initialQuote) {
      setQuote(initialQuote);
    } else {
      // Ensure new quotes use the latest defaults from constants
      setQuote({
        number: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random()*1000)).padStart(3, '0')}`,
        customer: MOCK_CUSTOMERS[0],
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [newEmptyLineItem()],
        status: QuoteStatus.DRAFT,
        currency: DEFAULT_CURRENCY,
        taxRate: DEFAULT_TAX_RATE,
      });
    }
  }, [initialQuote]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
     if (name === "customerId") {
        const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === value);
        setQuote(prev => ({ ...prev, customer: selectedCustomer || MOCK_CUSTOMERS[0] }));
    } else {
        setQuote(prev => ({ ...prev, [name]: name === 'taxRate' ? parseFloat(value) : value }));
    }
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...(quote.items || [])];
    const itemToUpdate = { ...newItems[index] };

    if (field === 'description') {
        const selectedCatalogItem = MOCK_ITEMS_CATALOG.find(ci => ci.name === value);
        if(selectedCatalogItem) {
            itemToUpdate.description = selectedCatalogItem.name;
            itemToUpdate.unitPrice = selectedCatalogItem.unitPrice;
        } else {
             itemToUpdate.description = value as string;
        }
    } else {
        (itemToUpdate[field] as any) = (field === 'quantity' || field === 'unitPrice') ? parseFloat(value as string) : value;
    }
    
    itemToUpdate.total = itemToUpdate.quantity * itemToUpdate.unitPrice;
    newItems[index] = itemToUpdate;
    setQuote(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setQuote(prev => ({ ...prev, items: [...(prev.items || []), newEmptyLineItem()] }));
  };

  const removeItem = (index: number) => {
    setQuote(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quote.customer && quote.issueDate && quote.expiryDate && quote.items && quote.items.length > 0) {
      onSave(quote as Quote);
    } else {
      alert("Please fill all required fields and add at least one item.");
    }
  };

  const itemOptions = MOCK_ITEMS_CATALOG.map(item => ({ value: item.name, label: `${item.name} (R ${item.unitPrice.toFixed(2)})` })); // Changed to R
  itemOptions.unshift({ value: '', label: 'Type custom description or select...' });


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Quote Number" name="number" value={quote.number || ''} onChange={handleChange} required />
         <Select
          label="Customer"
          name="customerId"
          value={quote.customer?.id || ''}
          onChange={handleChange}
          options={MOCK_CUSTOMERS.map(c => ({ value: c.id, label: c.name }))}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Issue Date" name="issueDate" type="date" value={quote.issueDate || ''} onChange={handleChange} required />
        <Input label="Expiry Date" name="expiryDate" type="date" value={quote.expiryDate || ''} onChange={handleChange} required />
         <Select
            label="Status"
            name="status"
            value={quote.status || QuoteStatus.DRAFT}
            onChange={handleChange}
            options={Object.values(QuoteStatus).map(s => ({ value: s, label: s }))}
            required
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900 border-t pt-4">Items</h3>
      {(quote.items || []).map((item, index) => (
         <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 border rounded-md bg-gray-50">
           <div className="col-span-12 md:col-span-5">
            <Select
              label={index === 0 ? "Description" : undefined}
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              options={itemOptions}
              className="mt-1"
            />
          </div>
          <div className="col-span-4 md:col-span-2">
             <Input label={index === 0 ? "Qty" : undefined} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))} min="0" step="any" className="mt-1" />
          </div>
          <div className="col-span-4 md:col-span-2">
            <Input label={index === 0 ? "Unit Price" : undefined} type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} min="0" step="0.01" className="mt-1" />
          </div>
          <div className="col-span-4 md:col-span-2">
            <Input label={index === 0 ? "Total" : undefined} type="number" value={item.total.toFixed(2)} readOnly className="mt-1 bg-gray-100" />
          </div>
          <div className="col-span-12 md:col-span-1 flex justify-end">
            {(quote.items || []).length > 1 && (
              <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)} aria-label="Remove item" className="mt-1 md:mt-0">
                <Trash2Icon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addItem} leftIcon={<PlusIcon className="w-4 h-4" />}>
        Add Item
      </Button>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-4">
        <div>
            <Input label={`Tax Rate (%)`} name="taxRate" type="number" value={quote.taxRate || DEFAULT_TAX_RATE} onChange={handleChange} min="0" step="0.01" />
        </div>
        <div className="md:col-span-2 text-right space-y-1 pt-4">
            <p className="text-gray-600">Subtotal: <span className="font-semibold text-gray-800">{quote.currency} {(quote.subtotal || 0).toFixed(2)}</span></p>
            <p className="text-gray-600">Tax ({quote.taxRate || 0}%): <span className="font-semibold text-gray-800">{quote.currency} {(quote.taxAmount || 0).toFixed(2)}</span></p>
            <p className="text-xl font-bold text-gray-900">Total: <span className="text-primary">{quote.currency} {(quote.totalAmount || 0).toFixed(2)}</span></p>
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={quote.notes || ''}
          onChange={handleChange}
        />
      </div>


      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialQuote ? 'Save Changes' : 'Create Quote'}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
