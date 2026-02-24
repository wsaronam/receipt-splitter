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
            <h2>Assign Items!</h2>
            <div className="items-list">
                {items.map((item, itemIndex) => (
                    <div key={itemIndex} className="item-card">
                        <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">${item.price.toFixed(2)}</span>
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
                    </div>
                ))}
            </div>
        </div>
    )
}




export default ItemsList;