export const getReceipts = () => {
    try {
        const receipts = localStorage.getItem('receipts');
        return receipts ? JSON.parse(receipts) : [];
    }
    catch (err) {
        console.error('Error getting receipts: ' + err);
        return [];
    }
}


export const saveReceipt = (receipt) => {
    try {
        const receipts = getReceipts();
        const newReceipt = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            filename: receipt.filename,
            items: receipt.items,
            people: receipt.people || [],
            assignments: receipt.assignments || {},
            splits: receipt.splits || {}
        };

        receipts.unshift(newReceipt);
        const shortenReceipts = receipts.slice(0, 20); // keep 20 newest receipts

        localStorage.setItem('receipts', JSON.stringify(shortenReceipts));
        return newReceipt;
    }

    catch (err) {
        console.error('Error saving receipt: ' + error);
        return null;
    }
}


export const deleteReceipt = (id) => {
    try {
        const receipts = getReceipts();
        const newList = receipts.filter(r => r.id !== id);
        localStorage.setItem('receipts', JSON.stringify(newList));
        return true;
    }
    catch (err) {
        console.error('Error deleting receipt: ' + err);
    }
}


export const clearAllReceipts = () => {
    try {
        localStorage.removeItem('receipts');
        return true;
    }
    catch (err) {
        console.error('Error clearing receipts: ' + err);
        return false;
    }
}