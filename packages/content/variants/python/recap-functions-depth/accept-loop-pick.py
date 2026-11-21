def pick(people, **match):
    out = []
    for person in people:
        ok = True
        for key in match:
            ok = ok and person[key] == match[key]
        if ok:
            out.append(person)
    return out


crew = [{"name": "Ada", "role": "pilot", "age": 36}, {"name": "Ben", "role": "medic", "age": 52}, {"name": "Cy", "role": "pilot", "age": 52}]
role = "pilot"
crew_sorted = sorted(crew, key=lambda x: (x["age"] * -1, x["name"]))
print("Oldest first: " + ", ".join([x["name"] for x in crew_sorted]))
mine = [x["name"] for x in pick(crew, role=role)]
mine.sort()
print("Role: " + role + ": " + (", ".join(mine) if mine else "none"))
print("Ages: " + " ".join(list(map(str, map(lambda x: x["age"], crew)))))
