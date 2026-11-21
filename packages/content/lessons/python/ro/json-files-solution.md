```py
import json

jucator = {"nume": "Ada", "nivel": 3, "obiecte": ["lanterna"]}

with open("salvare.json", "w") as f:
    json.dump(jucator, f)

with open("salvare.json") as f:
    joc = json.load(f)
joc["nivel"] += 1
joc["obiecte"].append("harta")

with open("salvare.json", "w") as f:
    json.dump(joc, f)

with open("salvare.json") as f:
    print(f.read())
print(f"Nivelul era: {jucator['nivel']}")
```
