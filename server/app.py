from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend (React) to connect

@app.route('/api/submit_complaint', methods=['POST'])
def submit_complaint():
    data = request.get_json()
    print("Received complaint:", data)

    # Extracting fields (optional but good for validation)
    name = data.get('name')
    email = data.get('email')
    location = data.get('location')
    urgency = data.get('urgency')
    description = data.get('description')

    # Here you can later save to PostgreSQL or any database
    print(f"Complaint by {name} ({urgency} urgency): {description}")

    return jsonify({'status': 'success', 'message': 'Complaint received successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
