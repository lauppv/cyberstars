pilots = [
    {"name": "kai", "time": 50},
    {"name": "Ada", "time": 42},
    {"name": "ben", "time": 50},
]

marked = sorted([(p["time"], p["name"].lower(), i) for i, p in enumerate(pilots)])
results = [pilots[i] for time, name, i in marked]
for place, pilot in enumerate(results, start=1):
    print(f"{place}. {pilot['name']} {pilot['time']}s")

names = []
for pilot in pilots:
    names.append(pilot["name"])
marked = sorted([(n.lower(), i, n) for i, n in enumerate(names)])
names = [n for low, i, n in marked]
print(f"By name: {', '.join(names)}")
