def pick(people, role):
    picked = []
    for person in people:
        if person["role"] == role:
            picked.append(person)
    return picked


crew = [
    {"name": "Ada", "role": "pilot", "age": 36},
    {"name": "Ben", "role": "medic", "age": 52},
    {"name": "Cy", "role": "pilot", "age": 52},
]
role = "pilot"

oldest = sorted(crew, key=lambda p: (-p["age"], p["name"]))
print(f"Oldest first: {', '.join([p['name'] for p in oldest])}")

found = sorted([p["name"] for p in pick(crew, role=role)])
if len(found) == 0:
    print(f"Role: {role}: none")
else:
    print(f"Role: {role}: {', '.join(found)}")

print(f"Ages: {' '.join(map(lambda p: str(p['age']), crew))}")
