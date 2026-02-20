import React, {useState} from 'react';
import './App.css';
import logo from './logo.svg';

import ReceiptUpload from './components/ReceiptUpload';
import ItemsList from './components/ItemsList';
import PeopleManager from './components/PeopleManager';
import SplitSummary from './components/SplitSummary';




function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [preview, setPreview] = useState(null);
  const [ocrResults, setOcrResults] = useState(null);

  const [people, setPeople] = useState([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [itemAssignments, setItemAssignments] = useState({});




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
  };

  const setPersonItem = (index, name) => {
    const currentAssignments = itemAssignments[index] || [];
    if (currentAssignments.includes(name)) {
      setItemAssignments({
        ...itemAssignments,
        [index]: currentAssignments.filter(p => p!== name)
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

    // const splits = {
    //   'John': 3,
    //   'Rob': 1.44444444444,
    //   ' Jacob    ': 1111.234
    // };
    return splits;
  };

  const splits = calculateSplit();




  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Receipt Splitter</h1>
        <p>Upload a receipt to split expenses with others</p>
      </header>

      <div className="upload-container">

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
            />

            <SplitSummary
              splits={splits}
              rawText={ocrResults.raw_text}
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