def pick(people, **match):
    return list(filter(lambda p: all(p[k] == v for k, v in match.items()), people))


crew = [{"name": "Ada", "role": "pilot", "age": 36}, {"name": "Ben", "role": "medic", "age": 52}, {"name": "Cy", "role": "pilot", "age": 52}]
role = "pilot"
by_name = sorted(crew, key=lambda p: p["name"])
oldest = sorted(by_name, key=lambda p: p["age"], reverse=True)
print("Oldest first:", ", ".join(p["name"] for p in oldest))
names = sorted(p["name"] for p in pick(crew, role=role))
print("Role:", role + ":", ", ".join(names) or "none")
print("Ages:", " ".join(map(str, [p["age"] for p in crew])))
