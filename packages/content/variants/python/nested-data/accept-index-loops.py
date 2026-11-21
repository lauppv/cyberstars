crew = [
    {"name": "Ada", "skills": ["math", "code"]},
    {"name": "Alan", "skills": ["code", "radio"]},
]
needed = "radio"
names = []
i = 0
while i < len(crew):
    person = crew[i]
    line = ""
    for j in range(len(person["skills"])):
        if j > 0:
            line = line + ", "
        line = line + person["skills"][j]
    if line == "":
        line = "no skills"
    print(f"{person['name']}: {line}")
    if needed in person["skills"]:
        names.append(person["name"])
    i += 1
print("Can do it:", ", ".join(names) if names else "nobody")
