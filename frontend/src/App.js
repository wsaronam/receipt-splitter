import React, {useState} from 'react';
import './App.css';

import logo from './logo.svg';




function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
    else {
      // need something else here
      setSelectedFile(null);
    }
  }
  
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('receipt', selectedFile);
    
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      // console.log(data);
    }
    catch (error) {
      console.log('Error in uploading')
    }
    finally {
      setUploading(false);
    }
  }
  
  const handleClear = () => {
    setSelectedFile(null);
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Receipt Splitter</h1>
        <p>Upload a receipt to split expenses with others</p>
      </header>

      <div className="upload-container">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>

      {selectedFile && (
        <div>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload & Process"}
          </button>
          <button onClick={handleClear}>
            Clear
          </button>
        </div>
      )}


    </div>
  );
}




export default App;