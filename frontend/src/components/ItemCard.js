import React from 'react';

import '../styles/ItemCard.css';



function ItemCard({
    item,
    itemIndex,
    people,
    itemAssignments,
    onSetPerson,
    onStartEditing,
    onDeleteItem
}) {
    return (
        <>
            <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>
                <div className="item-actions">
                    <button 
                        onClick={() => onStartEditing(itemIndex, item)}
                        className="edit-btn"
                        title="Edit item"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => onDeleteItem(itemIndex)}
                        className="delete-btn"
                        title="Delete item"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {people.length > 0 && (
                <div className="person-buttons">
                    {people.map((person, personIndex) => (
                        <button
                            key={personIndex}
                            className={`person-toggle ${(itemAssignments[itemIndex] || []).includes(person) ? 'active' : ''}`}
                            onClick={() => onSetPerson(itemIndex, person)}
                        >
                            {person}
                        </button>
                    ))}
                </div>
            )}
        </>
    )
}




export default ItemCard;