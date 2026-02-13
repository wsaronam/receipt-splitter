import React from 'react';
import '../styles/ReceiptUpload.css';




function ReceiptUpload ({
    preview,
    onFileSelect,
    onDrop,
    onDragOver,
    onUpload,
    onClear,
    uploading,
    uploadStatus
}) {
    return (
        <div>
            <div 
                className="drop-area"
                onDrop={onDrop}
                onDragOver={onDragOver}
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
                    onChange={onFileSelect}
                    style={{ display: 'none' }}
                />
            </div>

            {preview && (
                <div className="actions">
                    <button onClick={onUpload} disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload & Process"}
                    </button>
                    <button onClick={onClear} className="second-button">
                        Clear
                    </button>
                </div>
            )}
                
            {uploadStatus && (
                <div className={`status ${uploadStatus.includes('success') ? 'success' : 'error'}`}>
                    {uploadStatus}
                </div>
            )}
        </div>
    );
}




export default ReceiptUpload;