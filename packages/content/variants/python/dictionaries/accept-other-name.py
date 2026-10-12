name = "Tommy"
role = "Pilot"
age = 34
station = "Laniakea"

member = dict(name=name, role=role, age=age)
member["station"] = station
member["age"] += 1

for field in ("name", "role", "age", "station"):
    print(member[field])
if "rank" not in member:
    print("Rank: unknown")
