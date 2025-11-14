import pandas as pd
import random
import spacy
from spacy.util import minibatch
from spacy.training.example import Example
from sklearn.metrics import classification_report, accuracy_score
import matplotlib.pyplot as plt
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
# 3️⃣ Load base model
# ======================================================
print("\n🧠 Loading pretrained spaCy model (en_core_web_md)...")
nlp = spacy.load("en_core_web_md")

# Remove existing textcat if any
if "textcat" in nlp.pipe_names:
    nlp.remove_pipe("textcat")

# ======================================================
# 4️⃣ Add text categorizer (correct config for spaCy ≥3.6)
# ======================================================
print("\n⚙️  Adding text categorizer (CNN architecture)...")

config = {
    "model": {
        "@architectures": "spacy.TextCatCNN.v2",
        "exclusive_classes": True,   # ✅ keep this only here
        "nO": None,
        "tok2vec": {
            "@architectures": "spacy.Tok2Vec.v2",
            "embed": {
                "@architectures": "spacy.MultiHashEmbed.v2",
                "width": 96,
                "rows": [2000, 2000, 500, 1000, 500],
                "attrs": ["NORM", "LOWER", "PREFIX", "SUFFIX", "SHAPE"],
                "include_static_vectors": False
            },
            "encode": {
                "@architectures": "spacy.MaxoutWindowEncoder.v2",
                "width": 96,
                "window_size": 1,
                "maxout_pieces": 3,
                "depth": 2
            }
        }
    }
}

textcat = nlp.add_pipe("textcat", last=True, config=config)
for lbl in labels:
    textcat.add_label(lbl)

print("✅ Text categorizer added successfully!")

# ======================================================
# 5️⃣ Initialize optimizer
# ======================================================
print("\n🔧 Initializing model...")
optimizer = nlp.initialize(
    lambda: [Example.from_dict(nlp.make_doc("sample"), {"cats": {lbl: 0 for lbl in labels}})]
)
losses_record = []

# ======================================================
# 6️⃣ Train model (CPU)
# ======================================================
n_iter = 25
print("\n🚀 Training started...\n")

for i in range(n_iter):
    random.shuffle(train_data)
    losses = {}
    batches = minibatch(train_data, size=64)

    for batch in tqdm(batches, desc=f"Epoch {i+1}/{n_iter}"):
        texts, annotations = zip(*batch)
        examples = [Example.from_dict(nlp.make_doc(t), a) for t, a in zip(texts, annotations)]
        nlp.update(examples, sgd=optimizer, losses=losses)

    loss_value = losses.get("textcat", 0)
    losses_record.append(loss_value)
    print(f"📉 Epoch {i+1}/{n_iter} - Loss: {loss_value:.4f}")

print("\n✅ Training complete!")

# ======================================================
# 7️⃣ Evaluate model
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
# 8️⃣ Plot training curve
# ======================================================
plt.figure(figsize=(8, 5))
plt.plot(range(1, n_iter + 1), losses_record, marker='o')
plt.title("Training Loss Curve")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.grid(True)
plt.savefig("training_curve.png")
plt.show()
print("📈 Training curve saved as 'training_curve.png'")

# ======================================================
# 9️⃣ Save final model
# ======================================================
output_dir = "grievance_textcat_model"
nlp.to_disk(output_dir)
print(f"💾 Model saved to '{output_dir}/'")

# ======================================================
# 🔟 Define quick prediction test
# ======================================================
def predict_complaint(text):
    doc = nlp(text)
    pred = max(doc.cats, key=doc.cats.get)
    conf = doc.cats[pred]
    return pred, conf

examples = [
    "The road near the hospital has large potholes.",
    "There is a power outage in our area since morning.",
    "The garbage truck hasn’t come for three days.",
    "The drainage is overflowing due to heavy rain.",
    "Street lights are not working in our colony.",
    "Low water pressure in our area since yesterday.",
    "Cracks have appeared on the wall of the community building."
]

print("\n🔍 Predictions on sample complaints:")
for text in examples:
    label, conf = predict_complaint(text)
    print(f"'{text}' → {label} (confidence: {conf:.2f})")
