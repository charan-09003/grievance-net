from flask import Blueprint, request, jsonify, current_app, g

from models.complaint import ComplaintModel
from models.request.complaint import ComplaintRequestModel
from services.smtp_mail import send_complaint
from services.helper import get_urgency_label


complaint_bp = Blueprint("complaint", __name__)


@complaint_bp.route('/submit_complaint', methods=['POST'])
def submit_complaint():
    data = request.get_json()

    name = g.user['name']
    email = g.user['email']
    complaint_req = ComplaintRequestModel(**data)

    model = current_app.model
    mongo = current_app.mongo

    doc = model(complaint_req.description)
    categories = doc.cats
    predicted_category = max(categories, key=categories.get)
    category_score = categories[predicted_category]

    final_urgency = (
        complaint_req.urgency
        if complaint_req.urgency
        else get_urgency_label(category_score)
    )
    complaint = ComplaintModel(
        name=name,
        email=email,
        location=complaint_req.location,
        description=complaint_req.description,
        urgency=final_urgency,
        predicted_category=predicted_category,
        category_scores=categories,
    )

    mongo.db.complaints.insert_one(complaint.model_dump())

    smtp_result = send_complaint(
        user_name=name,
        user_email=email,
        department=predicted_category,
        user_address=complaint.location,
        complaint_subject=f"{predicted_category} issue at {complaint.location}",
        complaint_description=complaint.description,
    )

    print(f"Complaint by {name} ({final_urgency} urgency): {complaint.description}")
    print(f"Predicted category: {predicted_category}, Score: {category_score:.2f}")

    return jsonify({
        "status": "success",
        "predicted_category": predicted_category,
        "category_score": category_score,
        "assigned_urgency": final_urgency,
        "smtp_result": smtp_result,
        "all_category_scores": categories
    })
