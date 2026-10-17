```py
scoruri = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}

def analizeaza(scoruri):
    total = 0
    for scor in scoruri.values():
        total = total + scor
    medie = total / len(scoruri)

    cel_mai_bun = ""
    maxim = 0
    for nume in scoruri:
        if scoruri[nume] > maxim:
            maxim = scoruri[nume]
            cel_mai_bun = nume

    promovati = []
    for nume in scoruri:
        if scoruri[nume] >= 50:
            promovati.append(nume)

    return {"medie": medie, "cel_mai_bun": cel_mai_bun, "promovati": promovati}

raport = analizeaza(scoruri)
print(f"Medie: {raport['medie']}")
print(f"Cel mai bun: {raport['cel_mai_bun']}")
print("Promovati:")
for nume in raport["promovati"]:
    print(nume)
```
