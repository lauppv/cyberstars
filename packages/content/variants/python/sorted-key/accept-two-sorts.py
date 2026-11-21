pilots = [{"name": "kai", "time": 50}, {"name": "Ada", "time": 42}, {"name": "ben", "time": 50}]
by_name = sorted(pilots, key=lambda p: p["name"].lower())
by_time = sorted(by_name, key=lambda p: p["time"])
place = 1
for p in by_time:
    print(str(place) + ". " + p["name"] + " " + str(p["time"]) + "s")
    place += 1
print("By name: " + ", ".join(p["name"] for p in by_name))
