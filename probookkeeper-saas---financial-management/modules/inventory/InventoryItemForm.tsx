
import React, { useState, useEffect } from 'react';
import { InventoryItem, CostTrackingMethod } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { MOCK_SUPPLIERS, MOCK_LOCATIONS } from '../../constants';

interface InventoryItemFormProps {
  initialItem?: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({ initialItem, onSave, onCancel }) => {
  const [item, setItem] = useState<Partial<InventoryItem>>(
    initialItem || {
      name: '',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      category: '',
      unit: 'pcs',
      purchaseCost: 0,
      salePrice: 0,
      currentStock: 0,
      reorderLevel: 10,
      costTrackingMethod: CostTrackingMethod.AVERAGE_COST,
    }
  );

  useEffect(() => {
    if (initialItem) {
      setItem(initialItem);
    } else {
      // Reset to default for new item, ensuring SKU is unique-ish for mock
       setItem({
        name: '',
        sku: `SKU-${Date.now().toString().slice(-6)}`, // More unique SKU
        category: '',
        unit: 'pcs',
        purchaseCost: 0,
        salePrice: 0,
        currentStock: 0,
        reorderLevel: 10,
        costTrackingMethod: CostTrackingMethod.AVERAGE_COST,
      });
    }
  }, [initialItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['purchaseCost', 'salePrice', 'currentStock', 'reorderLevel', 'optimumLevel'];
    setItem(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.name || !item.sku || !item.unit) {
        alert("Please fill in Name, SKU, and Unit.");
        return;
    }
    onSave(item as InventoryItem);
  };

  const supplierOptions = MOCK_SUPPLIERS.map(s => ({ value: s.id, label: s.name }));
  supplierOptions.unshift({ value: '', label: 'None' });

  const locationOptions = MOCK_LOCATIONS.map(l => ({ value: l.id, label: l.name }));
  locationOptions.unshift({ value: '', label: 'None' });
  
  const costTrackingOptions = Object.values(CostTrackingMethod).map(method => ({
    value: method,
    label: method,
  }));

  const unitOptions = [
    {value: 'pcs', label: 'Pieces (pcs)'},
    {value: 'kg', label: 'Kilograms (kg)'},
    {value: 'g', label: 'Grams (g)'},
    {value: 'ltr', label: 'Liters (ltr)'},
    {value: 'ml', label: 'Milliliters (ml)'},
    {value: 'box', label: 'Box'},
    {value: 'pack', label: 'Pack'},
    {value: 'ream', label: 'Ream'},
    {value: 'bag', label: 'Bag'},
    {value: 'set', label: 'Set'},
  ];


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Item Name*" name="name" value={item.name || ''} onChange={handleChange} required />
        <Input label="SKU*" name="sku" value={item.sku || ''} onChange={handleChange} required />
      </div>
      
      <Input label="Description" name="description" value={item.description || ''} onChange={handleChange} wrapperClassName="mb-0" />
      <textarea
        name="description"
        rows={3}
        className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        value={item.description || ''}
        onChange={handleChange}
        placeholder="Detailed description of the item"
      />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Category" name="category" value={item.category || ''} onChange={handleChange} />
         <Select
            label="Unit of Measure*"
            name="unit"
            value={item.unit || 'pcs'}
            onChange={handleChange}
            options={unitOptions}
            required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Purchase Cost (R)" name="purchaseCost" type="number" value={item.purchaseCost || 0} onChange={handleChange} step="0.01" /> {/* Changed to (R) */}
        <Input label="Sale Price (R)" name="salePrice" type="number" value={item.salePrice || 0} onChange={handleChange} step="0.01" /> {/* Changed to (R) */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Current Stock" name="currentStock" type="number" value={item.currentStock || 0} onChange={handleChange} step="any" />
        <Input label="Reorder Level" name="reorderLevel" type="number" value={item.reorderLevel || 0} onChange={handleChange} step="any" />
        <Input label="Optimum Level" name="optimumLevel" type="number" value={item.optimumLevel || ''} onChange={handleChange} step="any" placeholder="Optional" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
            label="Preferred Supplier"
            name="preferredSupplierId"
            value={item.preferredSupplierId || ''}
            onChange={handleChange}
            options={supplierOptions}
        />
        <Select
            label="Primary Location"
            name="locationId"
            value={item.locationId || ''}
            onChange={handleChange}
            options={locationOptions}
        />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
            label="Cost Tracking Method"
            name="costTrackingMethod"
            value={item.costTrackingMethod || CostTrackingMethod.AVERAGE_COST}
            onChange={handleChange}
            options={costTrackingOptions}
        />
        <Input label="Barcode (UPC/EAN)" name="barcode" value={item.barcode || ''} onChange={handleChange} />
      </div>

       <Input label="Image URL" name="imageUrl" value={item.imageUrl || ''} onChange={handleChange} placeholder="https://example.com/image.png" />
        {item.imageUrl && <img src={item.imageUrl} alt={item.name || 'Item'} className="mt-2 h-20 w-20 object-cover rounded" />}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={item.notes || ''}
          onChange={handleChange}
        />
      </div>


      <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialItem ? 'Save Changes' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;
