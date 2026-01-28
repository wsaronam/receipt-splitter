import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv



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


@app.route('/upload', methods=['POST'])
def upload_receipt():
    return




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)