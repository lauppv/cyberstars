def pick(people, **match):
    return [p for p in people if all(p[k] == v for k, v in match.items())]


crew = [{"name": "Ada", "role": "pilot", "age": 36}, {"name": "Ben", "role": "medic", "age": 52}, {"name": "Cy", "role": "pilot", "age": 52}]
role = "pilot"
oldest = sorted(crew, key=lambda p: (p["age"], p["name"]))
print("Oldest first: " + ", ".join(p["name"] for p in oldest))
names = sorted(p["name"] for p in pick(crew, role=role))
print("Role: " + role + ": " + (", ".join(names) or "none"))
print("Ages: " + " ".join(map(str, [p["age"] for p in crew])))
