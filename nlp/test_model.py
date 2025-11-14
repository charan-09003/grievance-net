import spacy

# 1. Load your saved model
nlp = spacy.load("grievance_textcat_model")

# 2. Define the text you want to classify
description = "The transformer near our house is making a loud buzzing noise."

# 3. Get predictions
doc = nlp(description)

# 4. Get the predicted category and confidence
predicted_category = max(doc.cats, key=doc.cats.get)
confidence = doc.cats[predicted_category]

print(f"🧾 Description: {description}")
print("\n🔍 Predictions:")
for label, score in doc.cats.items():
    print(f"  {label}: {score:.3f}")

print(f"\n✅ Predicted Department: {predicted_category} (Confidence: {confidence:.2f})")
