import pandas as pd
import random
import spacy
from spacy.util import minibatch
from spacy.training.example import Example
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

# ======================================================
# 1️⃣ Load and prepare dataset
# ======================================================
df = pd.read_csv("data.csv")

# Clean data
df = df.dropna(subset=["description", "category"])
labels = sorted(df["category"].unique().tolist())
print(f"📂 Loaded {len(df)} complaints across {len(labels)} departments.")
print("Departments:", labels)

# ======================================================
# 2️⃣ Convert data into spaCy training format
# ======================================================
train_data = []
for text, label in zip(df["description"], df["category"]):
    cats = {lbl: 0 for lbl in labels}
    cats[label] = 1
    train_data.append((text, {"cats": cats}))

# Shuffle and split (80/20)
random.shuffle(train_data)
split = int(0.8 * len(train_data))
train_data, test_data = train_data[:split], train_data[split:]

# ======================================================
# 3️⃣ Load Transformer-based spaCy model
# ======================================================
print("\n🧠 Loading transformer-based model (en_core_web_trf)...")
nlp = spacy.load("en_core_web_trf")

# Remove textcat if it exists
if "textcat" in nlp.pipe_names:
    nlp.remove_pipe("textcat")

# Add new text categorizer
textcat = nlp.add_pipe("textcat", last=True)
for lbl in labels:
    textcat.add_label(lbl)

# ======================================================
# 4️⃣ Initialize optimizer properly
# ======================================================
print("\n🔧 Initializing model...")
optimizer = nlp.initialize(lambda: [Example.from_dict(nlp.make_doc("sample"), {"cats": {lbl: 0 for lbl in labels}})])
losses_record = []

# ======================================================
# 5️⃣ Train model
# ======================================================
n_iter = 10  # Transformer learns faster; 10–12 epochs are enough
print("\n🚀 Training started...\n")

for i in range(n_iter):
    random.shuffle(train_data)
    losses = {}
    batches = minibatch(train_data, size=16)  # Transformers work best with smaller batches

    for batch in tqdm(batches, desc=f"Epoch {i+1}/{n_iter}"):
        texts, annotations = zip(*batch)
        examples = [Example.from_dict(nlp.make_doc(t), a) for t, a in zip(texts, annotations)]
        nlp.update(examples, sgd=optimizer, losses=losses, drop=0.2)
    
    loss_value = losses.get("textcat", 0)
    losses_record.append(loss_value)
    print(f"📉 Epoch {i+1}/{n_iter} - Loss: {loss_value:.4f}")

print("\n✅ Training complete!")

# ======================================================
# 6️⃣ Evaluate model
# ======================================================
y_true, y_pred = [], []

for text, ann in test_data:
    doc = nlp(text)
    pred_label = max(doc.cats, key=doc.cats.get)
    true_label = max(ann["cats"], key=ann["cats"].get)
    y_true.append(true_label)
    y_pred.append(pred_label)

print("\n📊 Evaluation Results:")
print(classification_report(y_true, y_pred, zero_division=0))
print("Overall Accuracy:", accuracy_score(y_true, y_pred))

# ======================================================
# 7️⃣ Confusion Matrix Visualization
# ======================================================
cm = confusion_matrix(y_true, y_pred, labels=labels)
plt.figure(figsize=(9,7))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels)
plt.title("Confusion Matrix - Department Classification")
plt.xlabel("Predicted Department")
plt.ylabel("True Department")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig("confusion_matrix.png")
plt.show()

# ======================================================
# 8️⃣ Plot Training Loss Curve
# ======================================================
plt.figure(figsize=(8,5))
plt.plot(range(1, n_iter + 1), losses_record, marker='o', linestyle='-')
plt.title("Training Loss Curve")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.grid(True)
plt.tight_layout()
plt.savefig("training_curve.png")
plt.show()

print("📈 Training curve saved as 'training_curve.png'")
print("📊 Confusion matrix saved as 'confusion_matrix.png'")

# ======================================================
# 9️⃣ Save trained model
# ======================================================
nlp.to_disk("grievance_textcat_trf_model")
print("💾 Model saved to 'grievance_textcat_trf_model/'")

# ======================================================
# 🔟 Define prediction function
# ======================================================
def predict_complaint(text):
    doc = nlp(text)
    pred = max(doc.cats, key=doc.cats.get)
    conf = doc.cats[pred]
    return pred, conf, doc.cats

# ======================================================
# 1️⃣1️⃣ Test predictions
# ======================================================
examples = [
    "The garbage truck hasn’t come for three days.",
    "Street light not working since last night.",
    "No water supply in our colony since morning.",
    "Sewage overflowing on the main road, foul smell everywhere.",
    "Building wall has developed big cracks, looks unsafe.",
    "Large potholes on the road causing accidents."
]

print("\n🔍 Predictions on sample complaints:")
for text in examples:
    label, conf, scores = predict_complaint(text)
    print(f"\n🧾 Description: {text}")
    print("🔍 Predictions:")
    for dept, score in scores.items():
        print(f"  {dept}: {score:.3f}")
    print(f"✅ Predicted Department: {label} (Confidence: {conf:.2f})")
