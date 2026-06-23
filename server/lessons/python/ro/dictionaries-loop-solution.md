```py
scoruri = {
    "Tommy": 88,
    "Lance": 95,
    "Cortez": 70,
    "Phil": 90,
    "Ken": 65,
    "Sonny": 78,
    "Diaz": 84,
    "Avery": 72,
    "Umberto": 60,
    "Mercedes": 83
}

for nume in scoruri.keys():
    print(nume)

for scor in scoruri.values():
    print(scor)

total = 0
for scor in scoruri.values():
    total = total + scor
print(f"Total: {total}")

print(f"Medie: {total / len(scoruri)}")

top = ""
maxim = 0
for nume in scoruri:
    if scoruri[nume] > maxim:
        maxim = scoruri[nume]
        top = nume
print(f"Top: {top}")
```
