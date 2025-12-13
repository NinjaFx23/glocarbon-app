import os
import random
import json  # <--- NEW: To handle JSON files
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__, static_url_path='', static_folder='.', template_folder='.')

# --- CONFIGURATION ---
UPLOAD_FOLDER = 'uploads'
DATABASE_FILE = 'database.json' # <--- NEW: The file path
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# --- DATABASE FUNCTIONS (Load & Save) ---
def load_data():
    """Reads the database.json file and returns the data."""
    if not os.path.exists(DATABASE_FILE):
        return {"users": [], "projects": []}
    try:
        with open(DATABASE_FILE, 'r') as f:
            return json.load(f)
    except:
        return {"users": [], "projects": []}

def save_data(data):
    """Writes the data back to database.json."""
    with open(DATABASE_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# --- HELPER FUNCTIONS ---
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_greenery(image_path):
    # (Your existing Smart HSV Logic)
    try:
        img = Image.open(image_path).convert('HSV')
        width, height = img.size
        green_pixel_count = 0
        total_sample = 0
        for x in range(0, width, 10):
            for y in range(0, height, 10):
                h, s, v = img.getpixel((x, y))
                total_sample += 1
                if 40 < h < 120 and s > 30 and v > 30:
                    green_pixel_count += 1
        if total_sample == 0: return 0
        green_percentage = (green_pixel_count / total_sample) * 100
        estimated_credits = int(green_percentage * 5)
        if green_percentage < 5: return 10
        return estimated_credits
    except:
        return 0

# --- ROUTES ---

@app.route('/')
def home():
    return render_template('index.html')

# --- AUTHENTICATION ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    db = load_data() # <--- LOAD
    
    for user in db['users']:
        if user['email'] == data['email']:
            return jsonify({'status': 'error', 'message': 'Email already exists!'})
    
    new_user = {
        'id': len(db['users']) + 1,
        'name': data['name'],
        'email': data['email'],
        'password': data['password'], 
        'role': data['role']
    }
    db['users'].append(new_user)
    save_data(db) # <--- SAVE
    
    return jsonify({'status': 'success', 'message': 'Account created! Please login.'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    db = load_data() # <--- LOAD
    
    for user in db['users']:
        if user['email'] == data['email'] and user['password'] == data['password']:
            return jsonify({
                'status': 'success', 
                'user': {'name': user['name'], 'role': user['role']}
            })
    return jsonify({'status': 'error', 'message': 'Invalid email or password'})

# --- CORE FEATURES ---

@app.route('/api/calculate', methods=['POST'])
def calculate_carbon():
    data = request.json
    hectares = float(data.get('hectares'))
    return jsonify({'status': 'success', 'carbon_estimate': hectares * 5})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part'})
    
    file = request.files['file']
    name = request.form.get('farm_name')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        credits = calculate_greenery(save_path)
        lat = -1.29 + random.uniform(-0.5, 0.5) 
        lng = 36.82 + random.uniform(-0.5, 0.5)

        db = load_data() # <--- LOAD
        new_project = {
            'id': len(db['projects']) + 1,
            'name': name,
            'image_url': filename,
            'credits': credits,
            'status': 'Verified by AI',
            'lat': lat,
            'lng': lng
        }
        db['projects'].append(new_project)
        save_data(db) # <--- SAVE

        return jsonify({'status': 'success', 'message': f'Verified! {credits} Credits found.'})
    return jsonify({'status': 'error'})

@app.route('/api/projects', methods=['GET'])
def get_projects():
    db = load_data() # <--- LOAD
    return jsonify(db['projects'])

@app.route('/api/buy', methods=['POST'])
def buy_credits():
    data = request.json
    project_id = data.get('project_id')
    buyer_name = data.get('buyer_name')

    db = load_data() # <--- LOAD
    
    found = False
    for project in db['projects']:
        if project['id'] == project_id:
            if project['status'] == 'SOLD':
                return jsonify({'status': 'error', 'message': 'Already sold!'})
            project['status'] = 'SOLD'
            project['buyer'] = buyer_name
            found = True
            break
    
    if found:
        save_data(db) # <--- SAVE
        return jsonify({'status': 'success', 'message': 'Credits purchased successfully!'})
    
    return jsonify({'status': 'error', 'message': 'Project not found.'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    from flask import send_from_directory
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- PWA ROUTES (Force Flask to serve these files) ---
@app.route('/manifest.json')
def manifest():
    from flask import send_from_directory
    return send_from_directory('.', 'manifest.json', mimetype='application/manifest+json')

@app.route('/sw.js')
def service_worker():
    from flask import send_from_directory
    return send_from_directory('.', 'sw.js', mimetype='application/javascript')

@app.route('/icon.png')
def app_icon():
    from flask import send_from_directory
    return send_from_directory('.', 'icon.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, port=5000)