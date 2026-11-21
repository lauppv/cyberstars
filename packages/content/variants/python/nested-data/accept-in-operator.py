crew = [
    {"name": "Ada", "skills": ["math", "code"]},
    {"name": "Alan", "skills": ["code", "radio"]},
]
needed = "radio"
found = ""
for member in crew:
    skills = member["skills"]
    text = ", ".join(skills) if skills else "no skills"
    print(member["name"] + ": " + text)
    if needed in skills:
        if found:
            found += ", "
        found += member["name"]
print("Can do it: " + (found or "nobody"))
