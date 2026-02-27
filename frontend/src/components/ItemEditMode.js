import React from "react";

import "../styles/ItemEditMode.css";




function ItemEditMode({
    item,
    itemIndex,
    editedItems,
    onUpdateEditing,
    onSaveEditing,
    onCancelEditing
}) {
    return (
        <div className="item-edit-mode">
            <div className="edit-inputs">
                <input 
                    type='text'
                    value={editedItems[itemIndex]?.name || item.name}
                    onChange={(e) => onUpdateEditing(itemIndex, 'name', e.target.value)}
                    placeholder="Item name"
                    className="edit-name-input"
                />
                <input
                    number="number"
                    value={editedItems[itemIndex]?.price || item.price}
                    onChange={(e) => onUpdateEditing(itemIndex, 'price', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="edit-price-input"
                />
            </div>
            <div className="edit-actions">
                <button
                    onClick={() => onSaveEditing(itemIndex)}
                    className="save-btn"
                >
                    Save
                </button>
                <button
                    onClick={onCancelEditing}
                    className="cancel-btn"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}




export default ItemEditMode;