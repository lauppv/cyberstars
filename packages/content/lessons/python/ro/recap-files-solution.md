```py
import json

evenimente = ["08:15 doc deschis", "08:40 pranzul echipajului", "13:05 doc inchis"]

with open("evenimente.txt", "w") as f:
    for eveniment in evenimente:
        f.write(eveniment + "\n")

numarari = {}
with open("evenimente.txt") as f:
    for linie in f:
        ora = linie[:2]
        numarari[ora] = numarari.get(ora, 0) + 1

with open("rezumat.json", "w") as f:
    json.dump(numarari, f)
with open("rezumat.json") as f:
    rezumat = json.load(f)

aglomerata = ""
for ora, numar in rezumat.items():
    print(f"{ora}: {numar}")
    if aglomerata == "" or numar > rezumat[aglomerata]:
        aglomerata = ora
print(f"Cea mai aglomerata: {aglomerata}")

with open("rezumat.json") as f:
    print(f"Caractere: {len(f.read())}")
```
