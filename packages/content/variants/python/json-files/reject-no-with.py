import json

player = {"name": "Ada", "level": 3, "items": ["torch"]}

f = open("save.json", "w")
json.dump(player, f)
f.close()

f = open("save.json")
game = json.load(f)
f.close()
game["level"] += 1
game["items"].append("map")

f = open("save.json", "w")
json.dump(game, f)
f.close()

f = open("save.json")
print(f.read())
f.close()
print(f"Level was: {player['level']}")
