
import React, { useState, useEffect, useCallback } from 'react';
import { Invoice, LineItem, Customer, InvoiceStatus } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { PlusIcon, Trash2Icon, SendIcon, MailIcon, FileTextIcon } from '../../components/icons/LucideIcons';
import { DEFAULT_CURRENCY, DEFAULT_TAX_RATE, MOCK_CUSTOMERS, MOCK_ITEMS_CATALOG, MOCK_PROJECTS } from '../../constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceFormProps {
  initialInvoice?: Invoice | null;
  onSave: (invoice: Invoice, action?: 'save_send') => void;
  onCancel: () => void;
}

const newEmptyLineItem = (): LineItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  description: '',
  quantity: 1,
  unitPrice: 0,
  total: 0,
});

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialInvoice, onSave, onCancel }) => {
  const invoiceFormRef = React.useRef<HTMLFormElement>(null);
  const [invoice, setInvoice] = useState<Partial<Invoice>>(
    initialInvoice || {
      number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*1000)).padStart(3, '0')}`,
      customer: MOCK_CUSTOMERS[0],
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      items: [newEmptyLineItem()],
      status: InvoiceStatus.DRAFT,
      currency: DEFAULT_CURRENCY, 
      taxRate: DEFAULT_TAX_RATE, 
      projectId: undefined,
    }
  );

  const calculateTotals = useCallback(() => {
    const items = invoice.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = invoice.taxRate || DEFAULT_TAX_RATE;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;
    setInvoice(prev => ({ ...prev, subtotal, taxAmount, totalAmount }));
  }, [invoice.items, invoice.taxRate]);

  useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice);
    } else {
       setInvoice({
        number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*1000)).padStart(3, '0')}`,
        customer: MOCK_CUSTOMERS[0],
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [newEmptyLineItem()],
        status: InvoiceStatus.DRAFT,
        currency: DEFAULT_CURRENCY,
        taxRate: DEFAULT_TAX_RATE,
        projectId: undefined,
      });
    }
  }, [initialInvoice]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "customerId") {
        const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === value);
        setInvoice(prev => ({ ...prev, customer: selectedCustomer || MOCK_CUSTOMERS[0] }));
    } else if (name === "projectId") {
        setInvoice(prev => ({ ...prev, projectId: value === '' ? undefined : value }));
    } else {
        setInvoice(prev => ({ ...prev, [name]: name === 'taxRate' ? parseFloat(value) : value }));
    }
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...(invoice.items || [])];
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
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({ ...prev, items: [...(prev.items || []), newEmptyLineItem()] }));
  };

  const removeItem = (index: number) => {
    setInvoice(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = (action?: 'save_send') => {
    if (invoice.customer && invoice.issueDate && invoice.dueDate && invoice.items && invoice.items.length > 0) {
      onSave(invoice as Invoice, action);
    } else {
      alert("Please fill all required fields and add at least one item.");
    }
  };

  const handleGeneratePdf = async () => {
    if (!invoiceFormRef.current) return;
    alert("PDF Generation started. This might take a moment. Please ensure content is visible (not inside a closed modal for best results if used elsewhere).");

    const canvas = await html2canvas(invoiceFormRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4', // approx letter size in pixels
        putOnlyUsedFonts:true,
        floatPrecision: 16 // or "smart", default is 16
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
    }
    pdf.save(`Invoice-${invoice.number || 'draft'}.pdf`);
  };

  const handleEmailInvoice = () => {
      if (!invoice.customer?.email) {
          alert("Customer email is not set for this invoice.");
          return;
      }
      const subject = `Invoice ${invoice.number} from ProBookkeeper SaaS`;
      const body = `Dear ${invoice.customer.name},\n\nPlease find attached your invoice ${invoice.number} for ${invoice.currency} ${invoice.totalAmount?.toFixed(2)}.\n\nDue Date: ${invoice.dueDate}\n\nThank you for your business!\n\n(This is a simulated email. In a real app, a PDF would be attached and sent via an email server.)`;
      const mailtoLink = `mailto:${invoice.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      alert("Simulated email: Your email client should open. A PDF would normally be attached.");
  };
  
  const itemOptions = MOCK_ITEMS_CATALOG.map(item => ({ value: item.name, label: `${item.name} (R ${item.unitPrice.toFixed(2)})` })); 
  itemOptions.unshift({ value: '', label: 'Type custom description or select...' });

  const projectOptions = MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name }));
  projectOptions.unshift({ value: '', label: 'None / Not Applicable' });


  return (
    <form ref={invoiceFormRef} onSubmit={(e) => {e.preventDefault(); handleSubmit();}} className="space-y-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Invoice Number" name="number" value={invoice.number || ''} onChange={handleChange} required />
        <Select
          label="Customer"
          name="customerId"
          value={invoice.customer?.id || ''}
          onChange={handleChange}
          options={MOCK_CUSTOMERS.map(c => ({ value: c.id, label: c.name }))}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Issue Date" name="issueDate" type="date" value={invoice.issueDate || ''} onChange={handleChange} required />
        <Input label="Due Date" name="dueDate" type="date" value={invoice.dueDate || ''} onChange={handleChange} required />
        <Select
            label="Status"
            name="status"
            value={invoice.status || InvoiceStatus.DRAFT}
            onChange={handleChange}
            options={Object.values(InvoiceStatus).map(s => ({ value: s, label: s }))}
            required
        />
      </div>
      
       <Select
        label="Link to Project (Optional)"
        name="projectId"
        value={invoice.projectId || ''}
        onChange={handleChange}
        options={projectOptions}
        wrapperClassName="md:col-span-1"
      />

      <h3 className="text-lg font-medium text-gray-900 border-t pt-4">Items</h3>
      {(invoice.items || []).map((item, index) => (
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
            {(invoice.items || []).length > 1 && (
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
            <Input label={`Tax Rate (%)`} name="taxRate" type="number" value={invoice.taxRate || DEFAULT_TAX_RATE} onChange={handleChange} min="0" step="0.01" />
        </div>
        <div className="md:col-span-2 text-right space-y-1 pt-4">
            <p className="text-gray-600">Subtotal: <span className="font-semibold text-gray-800">{invoice.currency} {(invoice.subtotal || 0).toFixed(2)}</span></p>
            <p className="text-gray-600">Tax ({invoice.taxRate || 0}%): <span className="font-semibold text-gray-800">{invoice.currency} {(invoice.taxAmount || 0).toFixed(2)}</span></p>
            <p className="text-xl font-bold text-gray-900">Total: <span className="text-primary">{invoice.currency} {(invoice.totalAmount || 0).toFixed(2)}</span></p>
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={invoice.notes || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="secondary" onClick={() => handleSubmit()} >
          {initialInvoice ? 'Save Changes' : 'Save Draft'}
        </Button>
         {invoice.status === InvoiceStatus.DRAFT && (
          <Button type="button" variant="primary" onClick={() => handleSubmit('save_send')} leftIcon={<SendIcon className="w-4 h-4"/>}>
            Save & Send
          </Button>
        )}
         {initialInvoice && invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.PAID && (
            <Button type="button" variant="primary" onClick={() => handleSubmit()}>
                Save Changes
            </Button>
        )}
        {initialInvoice && (
            <Button type="button" variant="outline" onClick={handleEmailInvoice} leftIcon={<MailIcon className="w-4 h-4"/>}>
                Email Invoice (Sim.)
            </Button>
        )}
         {initialInvoice && (
            <Button type="button" variant="outline" onClick={handleGeneratePdf} leftIcon={<FileTextIcon className="w-4 h-4"/>}>
                Download PDF (Sim.)
            </Button>
        )}
      </div>
    </form>
  );
};

export default InvoiceForm;
