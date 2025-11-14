import spacy

# Load the trained grievance classification model
nlp = spacy.load("textcat_model")

# Test complaint descriptions
test_descriptions = [
    "There is a pothole on the main road causing traffic jams.",
    "Street lights are not working in our area for the past week.",
    "Garbage has not been collected from our colony for three days.",
    "The drainage water is overflowing near my house.",
    "Electric pole wires are hanging dangerously low.",
    "Roadside waste is creating a foul smell.",
    "Sewage water is leaking onto the street.",
]

# Predict category for each complaint
print("\n🔍 Complaint Category Predictions:")
for desc in test_descriptions:
    doc = nlp(desc)
    pred_label = max(doc.cats, key=doc.cats.get)
    confidence = doc.cats[pred_label]
    print(f"'{desc}' → {pred_label} (confidence: {confidence:.2f})")
