```py
linii = ["# dimineata", "08:00 21", "", "09:00 25", "10:00 19"]

with open("temperaturi.txt", "w") as f:
    for linie in linii:
        f.write(linie + "\n")

temperaturi = []
with open("temperaturi.txt") as f:
    for linie in f:
        linie = linie.strip()
        if linie == "" or linie.startswith("#"):
            continue
        ora, valoare = linie.split()
        temperaturi.append(int(valoare))

print(f"Citiri: {len(temperaturi)}")
if len(temperaturi) > 0:
    print(f"Minima: {min(temperaturi)}")
    print(f"Maxima: {max(temperaturi)}")
    print(f"Media: {sum(temperaturi) / len(temperaturi):.1f}")
```
