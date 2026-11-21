```py
pilots = [
    {"name": "kai", "time": 50},
    {"name": "Ada", "time": 42},
    {"name": "ben", "time": 50},
]

results = sorted(pilots, key=lambda p: (p["time"], p["name"].lower()))
for place, pilot in enumerate(results, start=1):
    print(f"{place}. {pilot['name']} {pilot['time']}s")

names = []
for pilot in pilots:
    names.append(pilot["name"])
names.sort(key=lambda n: n.lower())
print(f"By name: {', '.join(names)}")
```
