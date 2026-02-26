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
        <>
            <div className="edit-inputs">
                <input 
                    placeholder="Item name"
                />
                <input
                    placeholder="0.00"
                />
            </div>
            <div className="edit-actions">
                <button>Save</button>
                <button>Cancel</button>
            </div>
        </>
    )
}




export default ItemEditMode;