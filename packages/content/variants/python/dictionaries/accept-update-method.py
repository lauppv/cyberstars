name = "Tommy"
role = "Pilot"
age = 34
station = "Laniakea"

crew = {"name": name, "role": role, "age": age}
crew.update({"station": station})
crew["age"] = crew.get("age") + 1
print("\n".join(str(v) for v in crew.values()))
print("Rank: " + crew.get("rank", "unknown"))
