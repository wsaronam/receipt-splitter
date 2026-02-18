import React from 'react';
import '../styles/SplitSummary.css';




function SplitSummary({
    splits,
    rawText
}) {

    console.log("p1")

    const total = Object.values(splits).reduce((sum, val) => sum + val, 0);
    console.log("p2")
    const people = Object.keys(splits);
    console.log("p3")
    if (people.length === 0) {
        return null;
    }

    console.log("p4")


    return (
        <div>
            <h2>Split Summary</h2>
            <div>
                {people.map((person, index) => (
                    <div key={index}>
                        <div>{person}</div>
                        <div>${splits[person].toFixed(2)}</div>
                    </div>
                ))}
            </div>

            {/* <div className="total-price">
                <strong>Total: </strong>
                ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div> */}

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
    )
}




export default SplitSummary;