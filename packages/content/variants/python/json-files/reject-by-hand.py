def as_text(value):
    if isinstance(value, str):
        return '"' + value + '"'
    if isinstance(value, list):
        return "[" + ", ".join([as_text(v) for v in value]) + "]"
    if isinstance(value, dict):
        return "{" + ", ".join([as_text(k) + ": " + as_text(v) for k, v in value.items()]) + "}"
    return str(value)


player = {"name": "Ada", "level": 3, "items": ["torch"]}

game = {"name": player["name"], "level": player["level"] + 1, "items": player["items"] + ["map"]}

with open("save.json", "w") as f:
    f.write(as_text(game))

with open("save.json") as f:
    print(f.read())
print(f"Level was: {player['level']}")
