import React from 'react';
import '../styles/ItemsList.css';



function ItemsList ({
    items,
    people,
    itemAssignments,
    onSetPerson
}) {
    return (
        <div className="results-container">
            <h2>Extracted Items</h2>
            <div className="items-list">
              {items.map((item, index) => 
                <div key={index} className="item-card">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">{item.price.toFixed(2)}</span>
                </div>
              )}
            </div>

            {people.length > 0 && (
                <div className="person-buttons">
                    {people.map((person, index) => (
                        <button
                            key={index}
                            className={`person-toggle ${(itemAssignments[index] || []).includes(person) ? 'active' : ''}`}
                            onClick={() => onSetPerson(index, person)}
                        >
                            {person}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}




export default ItemsList;