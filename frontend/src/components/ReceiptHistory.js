import React, {useState, useEffect} from 'react';
import '../styles/ReceiptHistory.css';

import { getReceipts, saveReceipt, deleteReceipt, clearAllReceipts } from '../utils/storage.js';




function ReceiptHistory({ onLoadReceipt, refreshTrigger }) {
    const [receipts, setReceipts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    


    
    useEffect(() => {
        loadReceipts();
    }, [refreshTrigger]);

    const loadReceipts = () => {
        const saved = getReceipts();
        setReceipts(saved);
    }


    const handleDelete = (id) => {
        console.log('handleDelete called by:', id);
        if (window.confirm('Are you sure you want to delete this receipt?')) {
            deleteReceipt(id);
            loadReceipts();
        }
    }

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to delete ALL of your saved receipts?')) {
            clearAllReceipts();
            loadReceipts();
        }
    }

    const handleLoad = (receipt) => {
        onLoadReceipt(receipt);
        setIsOpen(false);
    }


    if (!isOpen) {
        return (
            <button onClick={(e) => {
                console.log('view history button pressed');
                e.stopPropagation();
                setIsOpen(true);
                }} className="history-toggle-btn">
                View History ({receipts.length})
            </button>
        );
    }
    


    
    return (
        <div className="history-container">
            <div className="history-header">
                <h2>Receipt History</h2>
                <div className="history-actions">
                    {receipts.length > 0 && (
                        <button onClick={handleClearAll} className="clear-all-btn">
                            Clear All
                        </button>
                    )}
                    <button onClick={() => setIsOpen(false)} className="close-btn">
                        x
                    </button>
                </div>
            </div>

            {receipts.length === 0 ? (
                <div className="no-history">
                    <p>No saved receipts found.</p>
                </div>    
            ) : (
                <div className="history-list">
                    {receipts.map((receipt) => (
                        <div key={receipt.id} className="history-card">
                            <div className="history-card-header">
                                <div className="history-card-info">
                                    <strong>{receipt.filename || 'Unnamed Receipt'}</strong>
                                    <span className="history-timestamp">
                                        {new Date(receipt.timestamp).toLocaleDateString()} {' '}
                                        {new Date(receipt.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="history-card-stats">
                                    <span>{receipt.items.length} items</span>
                                    {receipt.people && receipt.people.length > 0 && (
                                        <span>{receipt.people.length} people</span>
                                    )}
                                </div>
                            </div>

                            <div className="history-card-actions">
                                <button onClick={() => handleLoad(receipt)} className="load-btn">
                                    Load
                                </button>
                                <button onClick={() => handleDelete(receipt.id)} className='delete-btn'>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}




export default ReceiptHistory;