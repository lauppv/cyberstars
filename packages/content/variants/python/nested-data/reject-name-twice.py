crew = [
    {"name": "Ada", "skills": ["math", "code"]},
    {"name": "Alan", "skills": ["code", "radio"]},
]
needed = "radio"
names = []
for person in crew:
    print(f"{person['name']}: {', '.join(person['skills']) or 'no skills'}")
    for skill in person["skills"]:
        if skill == needed:
            names.append(person["name"])
print("Can do it: " + (", ".join(names) or "nobody"))
