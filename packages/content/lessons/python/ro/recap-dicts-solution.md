```py
scoruri = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}

def analizeaza(scoruri):
    total = 0
    for scor in scoruri.values():
        total = total + scor
    medie = total / len(scoruri)

    top = ""
    maxim = 0
    for nume in scoruri:
        if scoruri[nume] > maxim:
            maxim = scoruri[nume]
            top = nume

    promovati = []
    for nume in scoruri:
        if scoruri[nume] >= 50:
            promovati.append(nume)

    return {"medie": medie, "top": top, "promovati": promovati}

raport = analizeaza(scoruri)
print(f"Medie: {raport['medie']}")
print(f"Cel mai bun: {raport['top']}")
print("Promovati:")
for nume in raport["promovati"]:
    print(nume)
```
