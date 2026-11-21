```py
mesaje = ["doc liber", "foc in laborator", "usa laboratorului deschisa"]
cuvant = "laborator"

with open("radio.txt", "w") as f:
    for mesaj in mesaje:
        f.write(mesaj + "\n")

with open("radio.txt") as sursa, open("alerte.txt", "w") as tinta:
    for linie in sursa.read().splitlines():
        if cuvant in linie:
            tinta.write(linie + "\n")

with open("alerte.txt") as f:
    alerte = f.read().splitlines()

for numar, alerta in enumerate(alerte, start=1):
    print(f"{numar}. {alerta}")
print(f"Alerte: {len(alerte)}")
```
