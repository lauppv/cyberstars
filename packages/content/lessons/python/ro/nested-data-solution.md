```py
echipaj = [
    {"nume": "Ada", "abilitati": ["matematica", "cod"]},
    {"nume": "Alan", "abilitati": ["cod", "radio"]},
]
necesar = "radio"

se_pricep = []
for persoana in echipaj:
    if len(persoana["abilitati"]) == 0:
        print(f"{persoana['nume']}: nicio abilitate")
    else:
        print(f"{persoana['nume']}: {', '.join(persoana['abilitati'])}")
    for abilitate in persoana["abilitati"]:
        if abilitate == necesar:
            se_pricep.append(persoana["nume"])
            break

if len(se_pricep) == 0:
    print("Se pricep: nimeni")
else:
    print(f"Se pricep: {', '.join(se_pricep)}")
```
