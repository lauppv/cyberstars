import json

player = {"name": "Ada", "level": 3, "items": ["torch"]}
with open("save.json", "w") as f:
    json.dump(player, f)
with open("save.json") as f:
    game = json.load(f)
game["level"] += 1
game["items"].append("map")
with open("save.json", "w") as f:
    f.write(str(game))
with open("save.json") as f:
    print(f.read())
print(f"Level was: {player['level']}")
