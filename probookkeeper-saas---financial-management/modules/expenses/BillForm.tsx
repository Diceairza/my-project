import React, { useState, useEffect, useCallback } from 'react';
import { Bill, BillLineItem, BillStatus, Supplier } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { PlusIcon, Trash2Icon } from '../../components/icons/LucideIcons';
import { DEFAULT_CURRENCY, DEFAULT_TAX_RATE, MOCK_SUPPLIERS, MOCK_PROJECTS } from '../../constants';

interface BillFormProps {
  initialBill?: Bill | null;
  onSave: (bill: Bill) => void;
  onCancel: () => void;
}

const newEmptyBillLineItem = (): BillLineItem => ({
  id: `bitem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  description: '',
  quantity: 1,
  unitPrice: 0,
  total: 0,
});

const BillForm: React.FC<BillFormProps> = ({ initialBill, onSave, onCancel }) => {
  const [bill, setBill] = useState<Partial<Bill>>(
    initialBill || {
      billNumber: '',
      supplierId: MOCK_SUPPLIERS.length > 0 ? MOCK_SUPPLIERS[0].id : '',
      billDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      items: [newEmptyBillLineItem()],
      status: BillStatus.DRAFT,
      currency: DEFAULT_CURRENCY,
      taxRate: MOCK_SUPPLIERS.length > 0 ? (MOCK_SUPPLIERS[0].defaultTaxRate ?? DEFAULT_TAX_RATE) : DEFAULT_TAX_RATE,
      projectId: undefined,
    }
  );

  const calculateTotals = useCallback(() => {
    const items = bill.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = bill.taxRate ?? DEFAULT_TAX_RATE;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;
    setBill(prev => ({ ...prev, subtotal, taxAmount, totalAmount }));
  }, [bill.items, bill.taxRate]);

  useEffect(() => {
    if (initialBill) {
      setBill(initialBill);
    } else {
       const firstSupplier = MOCK_SUPPLIERS.length > 0 ? MOCK_SUPPLIERS[0] : null;
       setBill({
        billNumber: '',
        supplierId: firstSupplier?.id || '',
        billDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [newEmptyBillLineItem()],
        status: BillStatus.DRAFT,
        currency: DEFAULT_CURRENCY,
        taxRate: firstSupplier?.defaultTaxRate ?? DEFAULT_TAX_RATE,
        projectId: undefined,
      });
    }
  }, [initialBill]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "supplierId") {
        const selectedSupplier = MOCK_SUPPLIERS.find(s => s.id === value);
        setBill(prev => ({ 
            ...prev, 
            supplierId: value,
            taxRate: selectedSupplier?.defaultTaxRate ?? DEFAULT_TAX_RATE // Update tax rate based on supplier
        }));
    } else if (name === "projectId") {
        setBill(prev => ({ ...prev, projectId: value === '' ? undefined : value }));
    } else {
        setBill(prev => ({ ...prev, [name]: name === 'taxRate' ? parseFloat(value) : value }));
    }
  };

  const handleItemChange = (index: number, field: keyof BillLineItem, value: string | number) => {
    const newItems = [...(bill.items || [])];
    const itemToUpdate = { ...newItems[index] };

    (itemToUpdate[field] as any) = (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') 
                                   ? parseFloat(value as string) 
                                   : value;
    
    itemToUpdate.total = itemToUpdate.quantity * itemToUpdate.unitPrice;
    // Note: item-specific tax is not fully implemented in total calculation here, using bill.taxRate for overall.
    // For full item-specific tax, calculateTotals would need to sum individual item tax amounts.
    newItems[index] = itemToUpdate;
    setBill(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setBill(prev => ({ ...prev, items: [...(prev.items || []), newEmptyBillLineItem()] }));
  };

  const removeItem = (index: number) => {
    setBill(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bill.supplierId || !bill.billNumber || !bill.billDate || !bill.dueDate || !bill.items || bill.items.length === 0) {
      alert("Please fill all required fields (Supplier, Bill #, Dates) and add at least one item.");
      return;
    }
    onSave(bill as Bill);
  };
  
  const supplierOptions = MOCK_SUPPLIERS.map(s => ({ value: s.id, label: s.name }));
  const projectOptions = MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name }));
  projectOptions.unshift({ value: '', label: 'None / Not Applicable' });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Supplier*"
          name="supplierId"
          value={bill.supplierId || ''}
          onChange={handleChange}
          options={supplierOptions}
          required
        />
        <Input label="Supplier Bill Number*" name="billNumber" value={bill.billNumber || ''} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Bill Date*" name="billDate" type="date" value={bill.billDate || ''} onChange={handleChange} required />
        <Input label="Due Date*" name="dueDate" type="date" value={bill.dueDate || ''} onChange={handleChange} required />
        <Select
            label="Status*"
            name="status"
            value={bill.status || BillStatus.DRAFT}
            onChange={handleChange}
            options={Object.values(BillStatus).map(s => ({ value: s, label: s }))}
            required
        />
      </div>

      <Select
        label="Link to Project (Optional)"
        name="projectId"
        value={bill.projectId || ''}
        onChange={handleChange}
        options={projectOptions}
        wrapperClassName="md:col-span-1"
      />

      <h3 className="text-lg font-medium text-gray-900 border-t pt-4">Items</h3>
      {(bill.items || []).map((item, index) => (
        <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 border rounded-md bg-gray-50">
           <div className="col-span-12 md:col-span-5">
            <Input label={index === 0 ? "Description" : undefined} name="description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="mt-1" required/>
          </div>
          <div className="col-span-4 md:col-span-2">
             <Input label={index === 0 ? "Qty" : undefined} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))} min="0" step="any" className="mt-1" required/>
          </div>
          <div className="col-span-4 md:col-span-2">
            <Input label={index === 0 ? "Unit Price" : undefined} type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} min="0" step="0.01" className="mt-1" required/>
          </div>
          <div className="col-span-4 md:col-span-2">
            <Input label={index === 0 ? "Total" : undefined} type="number" value={item.total.toFixed(2)} readOnly className="mt-1 bg-gray-100" />
          </div>
          <div className="col-span-12 md:col-span-1 flex justify-end">
            {(bill.items || []).length > 1 && (
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
            <Input label={`Tax Rate (%)`} name="taxRate" type="number" value={bill.taxRate ?? DEFAULT_TAX_RATE} onChange={handleChange} min="0" step="0.01" />
        </div>
        <div className="md:col-span-2 text-right space-y-1 pt-4">
            <p className="text-gray-600">Subtotal: <span className="font-semibold text-gray-800">{bill.currency} {(bill.subtotal || 0).toFixed(2)}</span></p>
            <p className="text-gray-600">Tax ({bill.taxRate || 0}%): <span className="font-semibold text-gray-800">{bill.currency} {(bill.taxAmount || 0).toFixed(2)}</span></p>
            <p className="text-xl font-bold text-gray-900">Total: <span className="text-primary">{bill.currency} {(bill.totalAmount || 0).toFixed(2)}</span></p>
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={bill.notes || ''}
          onChange={handleChange}
        />
      </div>

      {/* Basic attachment simulation */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">Attachment URL (Optional)</label>
        <Input name="attachmentUrl" placeholder="https://example.com/receipt.pdf" onChange={(e) => setBill(prev => ({...prev, attachments: [{name: 'attachment', url: e.target.value}]}))} />
      </div> */}


      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialBill ? 'Save Changes' : 'Create Bill'}
        </Button>
      </div>
    </form>
  );
};

export default BillForm;