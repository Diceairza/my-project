
import React, { useState } from 'react';
import { InventoryItem, StockAdjustment } from '../../types';
import { MOCK_INVENTORY_ITEMS } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { PlusIcon, RepeatIcon } from '../../components/icons/LucideIcons';
import InventoryItemList from './InventoryItemList';
import InventoryItemForm from './InventoryItemForm';
import StockAdjustmentForm from './StockAdjustmentForm'; // New form

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [itemToAdjust, setItemToAdjust] = useState<InventoryItem | null>(null);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]); // For logging, not fully used yet


  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = (itemToSave: InventoryItem) => {
    if (editingItem) {
      setItems(prevItems => prevItems.map(item => item.id === itemToSave.id ? itemToSave : item));
    } else {
      setItems(prevItems => [...prevItems, { ...itemToSave, id: `invitem_${Date.now()}` }]);
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleOpenStockAdjustmentModal = (item?: InventoryItem) => {
    setItemToAdjust(item || null); // If no item passed, form will show a selector
    setIsAdjustmentModalOpen(true);
  };

  const handleStockAdjustment = (adjustment: Omit<StockAdjustment, 'id' | 'itemName'>) => {
    const targetItem = items.find(i => i.id === adjustment.itemId);
    if (!targetItem) {
        alert("Item to adjust not found!");
        return;
    }

    setItems(prevItems => 
        prevItems.map(item => 
            item.id === adjustment.itemId 
            ? { ...item, currentStock: item.currentStock + adjustment.quantityChange } 
            : item
        )
    );
    const newAdjustmentLog: StockAdjustment = {
        ...adjustment,
        id: `adj_${Date.now()}`,
        itemName: targetItem.name,
    };
    setStockAdjustments(prev => [...prev, newAdjustmentLog]);
    setIsAdjustmentModalOpen(false);
    setItemToAdjust(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Inventory Management</h2>
        <div className="space-x-2">
            <Button onClick={() => handleOpenStockAdjustmentModal()} leftIcon={<RepeatIcon className="w-4 h-4"/>} variant="outline">
                Adjust Stock
            </Button>
            <Button onClick={handleAddNewItem} leftIcon={<PlusIcon className="w-4 h-4" />}>
                Add New Item
            </Button>
        </div>
      </div>

      <InventoryItemList
        items={items}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onAdjustStock={handleOpenStockAdjustmentModal}
      />

      <Modal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        size="lg"
      >
        <InventoryItemForm
          initialItem={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setIsItemModalOpen(false);
            setEditingItem(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isAdjustmentModalOpen}
        onClose={() => {
            setIsAdjustmentModalOpen(false);
            setItemToAdjust(null);
        }}
        title="Adjust Stock Level"
        size="md"
      >
        <StockAdjustmentForm
          items={items}
          initialItemToAdjust={itemToAdjust}
          onAdjust={handleStockAdjustment}
          onCancel={() => {
            setIsAdjustmentModalOpen(false);
            setItemToAdjust(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default InventoryPage;
