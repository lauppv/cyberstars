```py
crew = {"name": "Tommy", "role": "Pilot", "age": 34}

crew["station"] = "Laniakea"
crew["age"] = crew["age"] + 1

print(crew["name"])
print(crew["role"])
print(crew["age"])
print(crew["station"])

if "rank" not in crew:
    print("Rank: unknown")
```
