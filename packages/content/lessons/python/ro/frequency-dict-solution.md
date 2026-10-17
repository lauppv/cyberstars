```py
semnale = ["B", "A", "C", "B", "A", "B", "D", "A", "B"]

frecventa = {}
for semnal in semnale:
    if semnal in frecventa:
        frecventa[semnal] += 1
    else:
        frecventa[semnal] = 1

for canal in sorted(frecventa):
    print(f"{canal}: {frecventa[canal]}")

cea_mai_buna = ""
cel_mai_mare = 0
for canal, contor in frecventa.items():
    if contor > cel_mai_mare:
        cel_mai_mare = contor
        cea_mai_buna = canal
print(f"Cel mai comun: {cea_mai_buna}")
```
