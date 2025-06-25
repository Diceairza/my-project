
import React, { useState, useEffect } from 'react';
import { InventoryItem, StockAdjustment } from '../../types';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface StockAdjustmentFormProps {
  items: InventoryItem[];
  initialItemToAdjust?: InventoryItem | null; // Optional: if adjusting from item list directly
  onAdjust: (adjustment: Omit<StockAdjustment, 'id' | 'itemName'>) => void;
  onCancel: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ items, initialItemToAdjust, onAdjust, onCancel }) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemToAdjust?.id || (items.length > 0 ? items[0].id : ''));
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialItemToAdjust) {
      setSelectedItemId(initialItemToAdjust.id);
    } else if (items.length > 0 && !selectedItemId) {
        setSelectedItemId(items[0].id); // Default to first item if none selected
    }
  }, [initialItemToAdjust, items, selectedItemId]);

  const selectedItem = items.find(item => item.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      alert('Please select an item to adjust.');
      return;
    }
    if (quantityChange === 0) {
      alert('Please enter a non-zero quantity to adjust.');
      return;
    }
    if (!reason.trim()) {
      alert('Please provide a reason for the adjustment.');
      return;
    }

    onAdjust({
      itemId: selectedItemId,
      date: new Date().toISOString().split('T')[0],
      quantityChange: quantityChange,
      reason: reason,
      notes: notes,
    });
  };

  const itemOptions = items.map(item => ({
    value: item.id,
    label: `${item.name} (SKU: ${item.sku}) - Stock: ${item.currentStock}`,
  }));
  
  const reasonOptions = [
    { value: '', label: 'Select a reason...' },
    { value: 'Stocktake Correction', label: 'Stocktake Correction' },
    { value: 'Damaged Goods', label: 'Damaged Goods' },
    { value: 'Lost/Stolen Goods', label: 'Lost/Stolen Goods' },
    { value: 'Return to Supplier', label: 'Return to Supplier' },
    { value: 'Promotion/Sample', label: 'Promotion/Sample' },
    { value: 'Other', label: 'Other (Specify in notes)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Select Item*"
        options={itemOptions}
        value={selectedItemId}
        onChange={(e) => setSelectedItemId(e.target.value)}
        disabled={!!initialItemToAdjust} // Disable if item is passed directly
        required
      />
      {selectedItem && (
        <p className="text-sm text-gray-600">
          Current Stock for <span className="font-semibold">{selectedItem.name}</span>: {selectedItem.currentStock} {selectedItem.unit}
        </p>
      )}
      <Input
        label="Quantity Change*"
        type="number"
        value={quantityChange.toString()}
        onChange={(e) => setQuantityChange(parseInt(e.target.value, 10) || 0)}
        placeholder="e.g., -5 or 10"
        helpText="Positive for increase, negative for decrease." // This will now be handled by Input component
        required
      />
       <Select
        label="Reason for Adjustment*"
        options={reasonOptions}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      <div>
        <label htmlFor="adjustmentNotes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="adjustmentNotes"
          name="adjustmentNotes"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional details about the adjustment"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Adjust Stock
        </Button>
      </div>
    </form>
  );
};

export default StockAdjustmentForm;
