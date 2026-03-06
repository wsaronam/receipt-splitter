/* eslint-disable no-undef */

import React, {useState} from 'react';
import './App.css';
import logo from './logo.svg';

import ReceiptHistory from './components/ReceiptHistory';
import ReceiptUpload from './components/ReceiptUpload';
import ItemsList from './components/ItemsList';
import PeopleManager from './components/PeopleManager';
import SplitSummary from './components/SplitSummary';
import { saveReceipt } from './utils/storage';




function App() {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [preview, setPreview] = useState(null);
  const [ocrResults, setOcrResults] = useState(null);

  const [people, setPeople] = useState([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [itemAssignments, setItemAssignments] = useState({});

  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [editedItems, setEditedItems] = useState({});

  const [savedReceiptId, setSavedReceiptId] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);




  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadStatus('');
      setOcrResults(null);
      setItemAssignments({});
    }
    else {
      setUploadStatus('Please select a valid image file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadStatus('');
      setOcrResults(null);
      setItemAssignments({});
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus('Uploading...');
    setOcrResults(null);

    const formData = new FormData();
    formData.append('receipt', selectedFile);
    
    try {
      console.log('sending file:', selectedFile.name);
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('response status: ' + response.status);
      const data = await response.json();
      if (response.ok) {
        setUploadStatus(`Receipt uploaded successfully.  Found ${data.items_found} items`);
        setOcrResults(data);
        console.log('server response: ' + JSON.stringify(data, null, 2));
      }
      else {
        setUploadStatus('Upload failed: ' + data.error);
      }
    }
    catch (error) {
      setUploadStatus('Error uploading image: ' + error.message);
      console.error('Upload error: ' + error);
    }
    finally {
      setUploading(false);
    }
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadStatus('');
    setOcrResults(null);
    setItemAssignments({});
  };
  

  const addPerson = () => {
    if (newPersonName.trim() && !people.includes(newPersonName.trim())) {
      setPeople([...people, newPersonName.trim()]);
      setNewPersonName('');
    }
  };

  const removePerson = (personName) => {
    setPeople(people.filter(p => p !== personName));

    const newAssignments = {...itemAssignments};
    Object.keys(newAssignments).forEach(index => {
      newAssignments[index] = newAssignments[index].filter(p => p !== personName);
    });
    setItemAssignments(newAssignments);
  };

  const setPersonItem = (index, name) => {
    console.log('clicked item:', index, 'person:', name);
    console.log('current assignments:', itemAssignments);
    const currentAssignments = itemAssignments[index] || [];
    if (currentAssignments.includes(name)) {
      setItemAssignments({
        ...itemAssignments,
        [index]: currentAssignments.filter(p => p !== name)
      });
    }
    else {
      setItemAssignments({
        ...itemAssignments,
        [index]: [...currentAssignments, name]
      });
    }
  };

  const calculateSplit = () => {
    const splits = {};
    people.forEach(person => {
      splits[person] = 0;
    });

    if (!ocrResults || !ocrResults.items) {
      return splits;
    }

    ocrResults.items.forEach((item, index) => {
      const assignedPeople = itemAssignments[index] || [];
      if (assignedPeople.length > 0) {
        const splitAmount = item.price / assignedPeople.length;
        assignedPeople.forEach(person => {
          splits[person] += splitAmount;
        });
      }
    });
    
    return splits;
  };


  const startEditingItem = (index, item) => {
    setEditingItemIndex(index);
    setEditedItems({
      ...editedItems,
      [index]: {name: item.name, price: item.price}
    });
  };

  const cancelEditingItem = () => {
    setEditingItemIndex(null);
  }

  const saveEditedItem = (index) => {
    if (editedItems[index]) {
      const updatedItems = [...ocrResults.items];
      updatedItems[index] = {
        ...updatedItems[index],
        name: editedItems[index].name,
        price: parseFloat(editedItems[index].price) || 0
      };

      setOcrResults({
        ...ocrResults,
        items: updatedItems
      });
    }

    setEditingItemIndex(null);
  }

  const updateEditedItem = (index, field, value) => {
    setEditedItems({
      ...editedItems,
      [index]: {
        ...editedItems[index],
        [field]: value
      }
    });
  }

  const deleteItem = (index) => {
    const updatedItems = ocrResults.items.filter((_, i) => i !== index);
    setOcrResults({
      ...ocrResults,
      items: updatedItems,
      items_found: updatedItems.length
    });

    const newAssignments = {...itemAssignments};
    delete newAssignments[index];

    const reindexedAssignments = {};
    Object.keys(newAssignments).forEach(key => {
      const oldIndex = parseInt(key);
      const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
      reindexedAssignments[newIndex] = newAssignments[key];
    })

    setItemAssignments(reindexedAssignments);
  }

  const addNewItem = () => {
    const newItem = {name: 'New Item', price: 0};
    const updatedItems = [...ocrResults.items, newItem];

    setOcrResults({
      ...ocrResults,
      items: updatedItems,
      items_found: updatedItems.length
    });
  }


  const handleSaveReceipt = () => {
    if (!ocrResults || !ocrResults.items || ocrResults.items.length === 0) {
      alert('No receipt to save!');
      return;
    }

    const receiptData = {
      filename: ocrResults.filename,
      items: ocrResults.items,
      people: people,
      assignments: itemAssignments,
      splits: calculateSplit(),
      raw_text: ocrResults.raw_text
    };

    const saved = saveReceipt(receiptData);
    if (saved) {
      setSavedReceiptId(saved.id);
      setHistoryRefresh(prev => prev + 1);
      alert('Receipt saved!');
    }
  }

  const handleLoadReceipt = (receipt) => {
    setOcrResults({
      items: receipt.items,
      filename: receipt.filename,
      items_found: receipt.items.length,
      raw_text: receipt.raw_text || ''
    });
    setPeople(receipt.people || []);
    setItemAssignments(receipt.assignments || {});
    setSavedReceiptId(receipt.id);
    setUploadStatus('Receipt loaded from history');
  }

  

  const splits = calculateSplit();




  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Receipt Splitter</h1>
        <p>Upload a receipt to split expenses with others</p>
      </header>

      <div className="upload-container">

        <ReceiptHistory 
          onLoadReceipt={handleLoadReceipt} 
          refreshTrigger={historyRefresh}
        />

        <ReceiptUpload
          preview={preview}
          onFileSelect={handleFileSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onUpload={handleUpload}
          onClear={handleClear}
          uploading={uploading}
          uploadStatus={uploadStatus}
        />

        {ocrResults && ocrResults.items && ocrResults.items.length > 0 && (
          <div>
            <div className="save-receipt-section">
              <button onClick={handleSaveReceipt} className="save-receipt-btn">
                Save Receipt to History
              </button>
            </div>

            <PeopleManager
              people={people}
              newPersonName={newPersonName}
              onNameChange={setNewPersonName}
              onAddPerson={addPerson}
              onRemovePerson={removePerson}
            />

            <ItemsList
              items={ocrResults.items}
              people={people}
              itemAssignments={itemAssignments}
              onSetPerson={setPersonItem}
              editingItemIndex={editingItemIndex}
              editedItems={editedItems}
              onStartEditing={startEditingItem}
              onCancelEditing={cancelEditingItem}
              onSaveEditing={saveEditedItem}
              onUpdateEditing={updateEditedItem}
              onDeleteItem={deleteItem}
              onAddItem={addNewItem}
            />

            <SplitSummary
              splits={splits}
              rawText={ocrResults.raw_text}
              items={ocrResults.items}
            />
          </div>
        )}

        {ocrResults && ocrResults.items && ocrResults.items.length === 0 && (
          <div className="no-items">
            <p>No items detected.  Receipt may unreadable or in a wrong format.  Please try again.</p>
            <details className="raw-text">
              <summary>View Raw OCR Text Results</summary>
              <pre>{ocrResults.raw_text}</pre>
            </details>
          </div>
        )}
        
      </div>
    </div>
  );
}




export default App;