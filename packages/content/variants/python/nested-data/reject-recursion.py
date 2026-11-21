crew = [
    {"name": "Ada", "skills": ["math", "code"]},
    {"name": "Alan", "skills": ["code", "radio"]},
]
needed = "radio"


def show(i, can_do):
    if i == len(crew):
        return can_do
    person = crew[i]
    if len(person["skills"]) == 0:
        print(f"{person['name']}: no skills")
    else:
        print(f"{person['name']}: {', '.join(person['skills'])}")
    if needed in person["skills"]:
        can_do = can_do + [person["name"]]
    return show(i + 1, can_do)


can_do = show(0, [])
if len(can_do) == 0:
    print("Can do it: nobody")
else:
    print(f"Can do it: {', '.join(can_do)}")
