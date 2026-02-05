import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from PIL import Image
import pytesseract




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

def extract_items_from_text(text):
    items = []
    lines = text.split('\n')
    # matches price-like strings (eg, $12.99, 12.99, $12)
    price_pattern = re.compile(r'\$?\d+\.?\d{0,2}')

    for line in lines:
        line = line.strip()
        print(line)
        if line:
            prices = price_pattern.findall(line)
            if prices:
                priceStr = prices[-1].replace('$', '')
                try:
                    price = float(priceStr)
                    itemName = re.sub(price_pattern, '', line).strip()
                    if itemName and 0 < price < 1000: # if it's a reasonable price?
                        items.append({
                            'name': itemName,
                            'price': price
                        })
                except ValueError:
                    continue
    return items                


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

    try:
        image = Image.open(filepath)
        extractedText = pytesseract.image_to_string(image)
        items = extract_items_from_text(extractedText)
        return jsonify({
            'message': 'Receipt processed successfully',
            'filename': filename,
            'raw_text': extractedText,
            'items': items,
            'items_found': len(items)
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error processing receipt: {str(e)}'}), 500




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)