import smtplib
from email.message import EmailMessage


department_emails = {
    "Building Department": "grievancenet@gmail.com",
    "Electric Department": "grievancenet@gmail.com",
    "Road Department": "grievancenet@gmail.com",
    "Sanitation Department": "grievancenet@gmail.com",
    "Sewerage Department": "grievancenet@gmail.com",
    "Water Supply Department": "grievancenet@gmail.com"
}

def send_complaint(
    user_name, user_email, department, complaint_subject, complaint_description,
    user_phone=None, user_address=None
):
    # Get the target government email
    gov_email = department_emails.get(department)
    if not gov_email:
        return f"Error: Invalid department '{department}'"

    # ------------------------------
    # 1️⃣ Complaint message template
    # ------------------------------
    complaint_body = f"""
To,
The Officer-in-Charge,
{department},
Government of India.

Dear Sir/Madam,

I am writing to bring to your attention the following issue under the jurisdiction of the {department}.

Complaint Details:
- Name: {user_name}
- Email: {user_email}
{f"- Phone: {user_phone}" if user_phone else ""}
{f"- Address: {user_address}" if user_address else ""}

Complaint Details:
- Subject: {complaint_subject}
- Description:
  {complaint_description}

I kindly request you to take the necessary action at the earliest and inform me regarding the resolution.

Thank you for your time and service.

Yours faithfully,
{user_name}
{user_email}
{user_phone if user_phone else ""}
"""

    # ------------------------------
    # 2️⃣ Email to government dept
    # ------------------------------
    msg = EmailMessage()
    msg['Subject'] = f"Complaint Regarding {complaint_subject} — Submitted by {user_name}"
    msg['From'] = "cherryorthon09003@gmail.com"  # replace with your SMTP email
    msg['To'] = gov_email
    msg.set_content(complaint_body)

    # ------------------------------
    # 3️⃣ Success email to user
    # ------------------------------
    user_msg = EmailMessage()
    user_msg['Subject'] = "Your Complaint Has Been Registered Successfully"
    user_msg['From'] = "cherryorthon09003@gmail.com"
    user_msg['To'] = user_email
    user_msg.set_content(f"""
Dear {user_name},

Your complaint regarding '{complaint_subject}' has been successfully submitted to the {department}.

We appreciate your effort in bringing this to our attention.
Our team will ensure the complaint reaches the concerned authorities for prompt action.

Best regards,
Government Support Team
""")

    # ------------------------------
    # 4️⃣ Send both emails via SMTP
    # ------------------------------
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.login("cherryorthon09003@gmail.com", "fbae wrwv jqsi sqgp")  # use app password, not your real one
            smtp.send_message(msg)       # send to department
            smtp.send_message(user_msg)  # confirmation to user
        return "Complaint sent successfully!"
    except Exception as e:
        return f"Error sending complaint: {e}"
