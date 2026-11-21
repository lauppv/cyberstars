import json

player = {"name": "Ada", "level": 3, "items": ["torch"]}
with open("save.json", "w") as f:
    json.dump(player, f)
with open("save.json") as f:
    state = json.loads(f.read())
state["level"] += 1
state["items"].append("map")
with open("save.json", "w") as f:
    json.dump(state, f)
with open("save.json") as f:
    json.load(f)
print(open("save.json").read())
print(f"Level was: {player['level']}")
