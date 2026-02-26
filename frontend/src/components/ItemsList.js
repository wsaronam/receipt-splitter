import React from 'react';
import '../styles/ItemsList.css';

import ItemCard from './ItemCard';
import ItemEditMode from './ItemEditMode';




function ItemsList ({
    items,
    people,
    itemAssignments,
    onSetPerson,
    editingItemIndex,
    editedItems,
    onStartEditing,
    onCancelEditing,
    onSaveEditing,
    onUpdateEditing,
    onDeleteItem,
    onAddItem
}) {
    return (
        <div className="results-container">
            <div className="items-header">
                <h2>Assign Items!</h2>
                <button 
                    onClick={onAddItem}
                    className="add-item-btn"
                >
                    ➕ Add Item
                </button>
            </div>

            <div className="items-list">
                {items.map((item, itemIndex) => (
                    <div key={itemIndex} className="item-card">
                        {editingItemIndex === itemIndex ? (
                            <ItemEditMode
                                item={item}
                                itemIndex={itemIndex}
                                editedItems={editedItems}
                                onUpdateEditing={onUpdateEditing}
                                onSaveEditing={onSaveEditing}
                                onCancelEditing={onCancelEditing}
                            />
                        ) : (
                            <ItemCard
                                item={item}
                                itemIndex={itemIndex}
                                people={people}
                                itemAssignments={itemAssignments}
                                onSetPerson={onSetPerson}
                                onStartEditing={onStartEditing}
                                onDeleteItem={onDeleteItem}
                            />
                        )}
                        
                    </div>
                ))}
            </div>
        </div>
    )
}




export default ItemsList;