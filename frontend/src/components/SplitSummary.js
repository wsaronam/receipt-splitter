import React from 'react';
import '../styles/SplitSummary.css';




function SplitSummary({
    splits,
    rawText,
    items
}) {

    const total = Object.values(splits).reduce((sum, val) => sum + val, 0);
    const receiptTotal = items ? items.reduce((sum, item) => sum + item.price, 0) : 0;
    const people = Object.keys(splits);




    return (
        <div className="split-summary">
            {people.length > 0 ? (
                <div>
                    <h2>Split Summary</h2>
                    <div className="split-cards">
                        {people.map((person, index) => (
                            <div key={index} className="split-card">
                                <div className="person-name">{person}</div>
                                <div className="person-total">${splits[person].toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <h2>Receipt Total</h2>
            )}
            

            <div className="total-price">
                <strong>Total: </strong>
                ${total.toFixed(2)}
            </div>

            {rawText && (
                <details className="raw-text">
                    <summary>View Raw OCR Text</summary>
                    <pre>{rawText}</pre>
                </details>
            )}
        </div>
    );
}




export default SplitSummary;