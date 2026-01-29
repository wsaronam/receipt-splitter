import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename




load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 #16MB limit


# make sure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



def allowed_file(filename):
    if '.' not in filename:
        return False
    file_extension = filename.rsplit('.', 1)[1].lower()
    return file_extension in ALLOWED_EXTENSIONS


@app.route('/status', methods=['GET'])
def check_status():
    return jsonify({'status': 'healthy', 'message': 'ReceiptSplitter online'})


@app.route('/upload', methods=['POST'])
def upload_receipt():
    if 'receipt' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['receipt']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type - must be an image'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    return jsonify({
        'message': 'Receipt uploaded successfully',
        'filename': filename,
        'filepath': filepath
    }), 200




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)