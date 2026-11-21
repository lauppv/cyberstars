import json

player = {"name": "Ada", "level": 3, "items": ["torch"]}
with open("save.json", "w") as f:
    json.dump(player, f)
with open("save.json") as f:
    json.load(f)
player["level"] += 1
player["items"].append("map")
with open("save.json", "w") as f:
    json.dump(player, f)
with open("save.json") as f:
    print(f.read())
print(f"Level was: {player['level']}")
