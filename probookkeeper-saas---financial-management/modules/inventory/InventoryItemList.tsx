
import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { InventoryItem } from '../../types';
import { EditIcon, Trash2Icon, RepeatIcon, PackageIcon } from '../../components/icons/LucideIcons';
import { MOCK_SUPPLIERS, MOCK_LOCATIONS, DEFAULT_CURRENCY } from '../../constants'; 

interface InventoryItemListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (itemId: string) => void;
  onAdjustStock: (item: InventoryItem) => void;
}

const InventoryItemList: React.FC<InventoryItemListProps> = ({ items, onEdit, onDelete, onAdjustStock }) => {
  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return 'N/A';
    return MOCK_SUPPLIERS.find(s => s.id === supplierId)?.name || 'Unknown';
  };

  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'N/A';
    return MOCK_LOCATIONS.find(l => l.id === locationId)?.name || 'Unknown';
  };

  const columns = [
    { Header: 'Name', accessor: 'name' as keyof InventoryItem, className: 'font-medium' },
    { Header: 'SKU', accessor: 'sku' as keyof InventoryItem },
    { Header: 'Category', accessor: 'category' as keyof InventoryItem, Cell: (cat?:string) => cat || 'N/A' },
    { Header: 'Stock', accessor: 'currentStock' as keyof InventoryItem, Cell: (stock: number, row: InventoryItem) => 
        <span className={stock <= row.reorderLevel ? 'text-red-600 font-semibold' : ''}>{stock} {row.unit}</span> },
    { Header: 'Cost Price', accessor: (row: InventoryItem) => `${DEFAULT_CURRENCY} ${row.purchaseCost.toFixed(2)}` },
    { Header: 'Sale Price', accessor: (row: InventoryItem) => `${DEFAULT_CURRENCY} ${row.salePrice.toFixed(2)}` },
    { 
      Header: 'Value on Hand', 
      accessor: (row: InventoryItem) => row.currentStock * row.purchaseCost,
      Cell: (value: number) => `${DEFAULT_CURRENCY} ${value.toFixed(2)}`,
      className: 'font-semibold'
    },
    // { Header: 'Supplier', accessor: (row: InventoryItem) => getSupplierName(row.preferredSupplierId) },
    // { Header: 'Location', accessor: (row: InventoryItem) => getLocationName(row.locationId) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof InventoryItem,
      Cell: (_: any, row: InventoryItem) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onAdjustStock(row)} aria-label="Adjust Stock" title="Adjust Stock">
            <RepeatIcon className="w-4 h-4 text-yellow-600 hover:text-yellow-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit">
            <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete">
            <Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {items.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
            <PackageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No inventory items found.</p>
            <p className="text-sm text-gray-400">Click "Add New Item" to get started.</p>
        </div>
      ) : (
        <Table<InventoryItem> columns={columns} data={items} />
      )}
    </>
  );
};

export default InventoryItemList;
