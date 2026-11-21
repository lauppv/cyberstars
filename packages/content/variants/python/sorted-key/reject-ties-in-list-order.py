pilots = [{"name": "kai", "time": 50}, {"name": "Ada", "time": 42}, {"name": "ben", "time": 50}]
ranked = sorted(pilots, key=lambda p: p["time"])
for i, p in enumerate(ranked, 1):
    print(f"{i}. {p['name']} {p['time']}s")
print("By name: " + ", ".join(sorted([p["name"] for p in pilots], key=str.lower)))
