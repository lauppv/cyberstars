def order(p):
    return p["time"], p["name"].lower()


pilots = [{"name": "kai", "time": 50}, {"name": "Ada", "time": 42}, {"name": "ben", "time": 50}]
ranked = list(pilots)
ranked.sort(key=order)
for i, p in enumerate(ranked):
    print(f"{i + 1}. {p['name']} {p['time']}s")
names = sorted([p["name"] for p in pilots], key=str.lower)
print("By name:", ", ".join(names))
