import json

player = {"name": "Ada", "level": 3, "items": ["torch"]}
with open("save.json", "w") as out:
    json.dump(player, out)
with open("save.json") as inp:
    data = json.load(inp)
data["level"] = data["level"] + 1
data["items"] = data["items"] + ["map"]
with open("save.json", "w") as out:
    json.dump(data, out)
with open("save.json") as inp:
    saved = inp.read()
print(saved)
print("Level was:", player["level"])
