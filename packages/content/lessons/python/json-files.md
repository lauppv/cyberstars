A text file holds only text. To save a dictionary or a list and get the same dictionary or list back later, we write it as **JSON**, a text format that almost every language and website understands. Python reads and writes it with the module `json`

---

`json.dumps()` turns Python data into a JSON string, and `json.loads()` turns the string back into Python data

```py
import json

player = {"name": "Ada", "level": 3, "items": ["torch", "rope"], "alive": True}
text = json.dumps(player)
print(text)

back = json.loads(text)
print(back["name"])
print(back["items"][1])
print(back == player)
```

Output

```text
{"name": "Ada", "level": 3, "items": ["torch", "rope"], "alive": true}
Ada
rope
True
```

JSON looks a lot like Python, with small changes: strings always have double quotes, `True` becomes `true`, `False` becomes `false` and `None` becomes `null`

---

To work with a file, use `json.dump()` and `json.load()`, without the `s`. They take the open file

```py
import json

scores = {"Ada": 12, "Alan": 7}
with open("scores.json", "w") as f:
    json.dump(scores, f)

with open("scores.json") as f:
    loaded = json.load(f)
loaded["Grace"] = 30
print(loaded)
```

Output

```text
{'Ada': 12, 'Alan': 7, 'Grace': 30}
```

That's how a program remembers things between runs: load the file at the start, change the data, save it again at the end

---

`indent=` makes the JSON easier for people to read, with one value on each line

```py
import json

print(json.dumps({"name": "Ada", "moons": [1, 2]}, indent=2))
```

Output

```text
{
  "name": "Ada",
  "moons": [
    1,
    2
  ]
}
```

---

JSON knows strings, numbers, true and false, null, lists and dictionaries, and nothing else. Tuples come back as lists, and the keys of a dictionary always become strings

```py
import json

print(json.loads(json.dumps({1: (2, 3)})))
```

Output

```text
{'1': [2, 3]}
```

---

## Mission: Save Game

A small game on the station saves the player between sessions. Each time the game starts, it loads the save, the player goes up a level and finds a map, and the game saves again

1. Start your program with a variable **player**, a dictionary with a `"name"` (a string), a `"level"` (a whole number) and `"items"` (a list of strings). For example `player = {"name": "Ada", "level": 3, "items": ["torch"]}`
2. Save **player** to `save.json` with `json.dump()`
3. Load `save.json` into a new variable, add 1 to its level and add `"map"` to the end of its items
4. Save the changed data to `save.json` again, the same way, without `indent`
5. Print the text of `save.json` as it is in the file, then print `Level was: ` and the level that **player** still has

**player** has a name of English letters, a level from 1 to 99, and from 0 to 5 items of small letters

**Example** for the player above

```text
{"name": "Ada", "level": 4, "items": ["torch", "map"]}
Level was: 3
```
