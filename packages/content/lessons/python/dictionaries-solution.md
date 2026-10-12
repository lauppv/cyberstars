```py
name = "Tommy"
role = "Pilot"
age = 34
station = "Laniakea"

crew = {"name": name, "role": role, "age": age}
crew["station"] = station
crew["age"] = crew["age"] + 1

print(crew["name"])
print(crew["role"])
print(crew["age"])
print(crew["station"])

if "rank" not in crew:
    print("Rank: unknown")
```
