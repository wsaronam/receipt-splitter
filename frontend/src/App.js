import React, {useState} from 'react';
import './App.css';

import logo from './logo.svg';




function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);


  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('receipt', selectedFile);
    
    // more stuff goes here
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
          type="file"
          accept="image/*"
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