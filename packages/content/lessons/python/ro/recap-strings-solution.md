```py
jurnal = "motor ionic=93.456;scut=7.1;sistem de viata=100"

cod = ""
for sistem in jurnal.split(";"):
    parti = sistem.split("=")
    nume = parti[0]
    valoare = float(parti[1])
    print(f"{nume:<16}{valoare:>6.1f} %")
    cod = cod + nume[0].upper()

cod = cod[::-1]
cheie = 0
for litera in cod:
    cheie = cheie + ord(litera)

print(f"Cod: {cod}")
print(f"Cheie: {cheie}")
```
