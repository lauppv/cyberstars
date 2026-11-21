```py
crew = [
    {"name": "Ada", "skills": ["math", "code"]},
    {"name": "Alan", "skills": ["code", "radio"]},
]
needed = "radio"

can_do = []
for person in crew:
    if len(person["skills"]) == 0:
        print(f"{person['name']}: no skills")
    else:
        print(f"{person['name']}: {', '.join(person['skills'])}")
    for skill in person["skills"]:
        if skill == needed:
            can_do.append(person["name"])
            break

if len(can_do) == 0:
    print("Can do it: nobody")
else:
    print(f"Can do it: {', '.join(can_do)}")
```
