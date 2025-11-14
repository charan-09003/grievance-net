from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import spacy
import os
from smtp_mail import send_complaint

app = Flask(__name__)
CORS(app)  # Allow frontend (React) to connect

# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)

# Load the spaCy model from the local folder
model_path = os.path.join(os.path.dirname(__file__), "grievance_textcat_model")
nlp = spacy.load(model_path)

# Function to assign urgency based on category score
def get_urgency_label(score):
    if score >= 0.75:
        return "High"
    elif score >= 0.5:
        return "Medium"
    else:
        return "Low"

@app.route('/api/submit_complaint', methods=['POST'])
def submit_complaint():
    data = request.get_json()
    print("Received complaint:", data)

    # Extract fields
    name = data.get('name')
    email = data.get('email')
    location = data.get('location')
    description = data.get('description')

    # Optional: user-provided urgency
    user_urgency = data.get('urgency')

    # --- Use the NLP model ---
    doc = nlp(description)
    categories = doc.cats  # Dictionary of category scores
    predicted_category = max(categories, key=categories.get)
    category_score = categories[predicted_category]
    
    # Assign urgency automatically based on score if not provided
    final_urgency = user_urgency if user_urgency else get_urgency_label(category_score)

    # Save to MongoDB
    mongo.db.complaints.insert_one({
        'name': name,
        'email': email,
        'location': location,
        'description': description,
        'predicted_category': predicted_category,
        'category_scores': categories,
        'urgency': final_urgency
    })

    smtp_result = send_complaint(
        user_name=name,
        user_email=email,
        department=predicted_category,
        user_address=location,
        complaint_subject=f"{predicted_category} issue reported at {location}",
        complaint_description=description,
    )

    print(f"Complaint by {name} ({final_urgency} urgency): {description}")
    print(f"Predicted category: {predicted_category}, Score: {category_score:.2f}")

    # Return response
    return jsonify({
        'status': 'success',
        'message': 'Complaint received successfully!',
        'predicted_category': predicted_category,
        'category_score': category_score,
        'assigned_urgency': final_urgency,
        'smtp_result': smtp_result,
        'all_category_scores': categories
    })

if __name__ == '__main__':
    app.run(debug=True)
