import pandas as pd
import random
from faker import Faker

fake = Faker("en_IN")

departments = [
    "Building Department",
    "Electric Department",
    "Road Department",
    "Sanitation Department",
    "Sewerage Department",
    "Water Supply Department"
]

# complaint phrases per department
templates = {
    "Building Department": [
        "Cracks have appeared on the wall of the {place}.",
        "An old building's wall has collapsed near the {place}.",
        "The roof of the community hall is leaking badly.",
        "Unsafe construction is happening beside my house.",
        "A damaged compound wall is blocking the pathway near {place}."
    ],
    "Electric Department": [
        "Street lights are not working on {place}.",
        "There is a power outage in our area since {time}.",
        "Electric wires are hanging dangerously near the road.",
        "Transformer near {place} is making loud noise.",
        "Voltage fluctuation happening frequently at my home."
    ],
    "Road Department": [
        "The road near {place} has deep potholes.",
        "Broken speed breakers are causing accidents.",
        "Main road near {place} is full of cracks.",
        "The newly laid road has worn out already.",
        "No proper signage on the bypass road."
    ],
    "Sanitation Department": [
        "Garbage has not been collected in {place} for {days} days.",
        "Dustbins are overflowing and attracting stray dogs.",
        "Public toilets near {place} are extremely dirty.",
        "Waste is being dumped on the roadside.",
        "Need immediate cleaning in the colony streets."
    ],
    "Sewerage Department": [
        "Drainage water is overflowing near {place}.",
        "Manhole cover missing at the junction near {place}.",
        "Sewage leakage causing foul smell across the street.",
        "Stagnant dirty water near my residence.",
        "Sewer line is blocked and needs urgent attention."
    ],
    "Water Supply Department": [
        "No water supply in {place} since {time}.",
        "Low water pressure in our area for the last {days} days.",
        "Water pipeline burst near {place}.",
        "Drinking water is contaminated and smells bad.",
        "Water leakage from the main valve near my home."
    ]
}

records = []
for _ in range(10000):
    dept = random.choice(departments)
    tpl = random.choice(templates[dept])
    text = tpl.format(
        place=fake.street_name(),
        time=random.choice(["morning", "yesterday", "two days"]),
        days=random.randint(1, 7)
    )
    records.append({"description": text, "category": dept})

df = pd.DataFrame(records)
df.to_csv("data.csv", index=False)
print("✅ Synthetic dataset saved as data.csv with", len(df), "records")
