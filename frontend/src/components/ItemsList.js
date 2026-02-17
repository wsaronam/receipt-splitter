import React from 'react';
import '../styles/ItemsList.css';



function ItemsList ({
    items,
    people,
    rawText
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
                <div>
                    {people.map((person, index) => (
                        <button
                            key={index}
                        >
                            {person}
                        </button>
                    ))}
                </div>
            )}

            <div className="total-price">
                <strong>Total: </strong>
                ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div>

            {rawText && (
                <details className="raw-text">
                    <summary>View Raw OCR Text Results</summary>
                    <pre>{rawText}</pre>
                </details>
            )}
        </div>
    )
}




export default ItemsList;