import React, {useState} from 'react';
import './App.css';

import logo from './logo.svg';




function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [preview, setPreview] = useState(null);
  const [ocrResults, setOcrResults] = useState(null);


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadStatus('');
      setOcrResults(null);
    }
    else {
      setUploadStatus('Please select a valid image file');
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadStatus('');
      setOcrResults(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  }
  

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
  }
  
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadStatus('');
    setOcrResults(null);
  }
  



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Receipt Splitter</h1>
        <p>Upload a receipt to split expenses with others</p>
      </header>

      <div className="upload-container">

        <div 
          className="drop-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('fileInput').click()}
        >

          {preview ? (
            <img src={preview} className="preview-image" />
          ) : (
            <div className="drop-area-text">
              <p>Drag and drop receipt image here</p>
              <p>or click to browse</p>
            </div>
          )}
        
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {selectedFile && (
        <div className="actions">
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload & Process"}
          </button>
          <button onClick={handleClear} className="second-button">
            Clear
          </button>
        </div>
      )}
      
      {uploadStatus && (
        <div className={`status ${uploadStatus.includes('success') ? 'success' : 'error'}`}>
          {uploadStatus}
        </div>
      )}

      {ocrResults && ocrResults.items && ocrResults.items.length > 0 && (
        <div>
          <h2>Extracted Items</h2>
        </div>
      )}

    </div>
  );
}




export default App;