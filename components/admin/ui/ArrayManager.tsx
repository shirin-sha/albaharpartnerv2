'use client';
import React from 'react';
import Button from './Button';

interface ArrayManagerProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number, onChange: (updatedItem: T) => void) => React.ReactNode;
  onChange: (items: T[]) => void;
  addButtonText?: string;
  emptyMessage?: string;
  maxItems?: number;
  className?: string;
}

export default function ArrayManager<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  onChange,
  addButtonText = 'Add Item',
  emptyMessage = 'No items yet. Click the button below to add one.',
  maxItems,
  className = '',
}: ArrayManagerProps<T>) {
  // Safety check: ensure items is always an array
  const safeItems = items || [];
  
  const handleItemChange = (index: number, updatedItem: T) => {
    const newItems = [...safeItems];
    newItems[index] = updatedItem;
    onChange(newItems);
  };

  const canAdd = !maxItems || safeItems.length < maxItems;

  return (
    <div className={className}>
      {safeItems.length === 0 ? (
        <div className="text-center p-4 border border-2 border-dashed rounded bg-light">
          <p className="text-muted mb-3">{emptyMessage}</p>
          {canAdd && (
            <Button onClick={onAdd} variant="primary" size="sm">
              + {addButtonText}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="d-flex flex-column gap-3">
            {safeItems.map((item, index) => (
              <div
                key={index}
                className="card border"
              >
                <div className="card-body position-relative">
                  <div className="position-absolute top-0 end-0 mt-2 me-2 d-flex align-items-center gap-2">
                    <span className="badge bg-secondary">#{index + 1}</span>
                    <Button
                      onClick={() => onRemove(index)}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                  <div style={{ paddingRight: '120px' }}>
                    {renderItem(item, index, (updatedItem) => handleItemChange(index, updatedItem))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {canAdd && (
            <div className="mt-3">
              <Button
                onClick={onAdd}
                variant="ghost"
                size="md"
                className="border-2 border-dashed px-4 py-3 d-inline-flex align-items-center justify-content-center"
              >
                + {addButtonText}
              </Button>
            </div>
          )}
          {maxItems && (
            <p className="text-muted text-center mt-2 mb-0">
              <small>{safeItems.length} of {maxItems} items added</small>
            </p>
          )}
        </>
      )}
    </div>
  );
}
