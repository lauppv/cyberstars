```py
semnale = ["B", "A", "C", "B", "A", "B", "D", "A", "B"]

freq = {}
for semnal in semnale:
    if semnal in freq:
        freq[semnal] += 1
    else:
        freq[semnal] = 1

for canal in sorted(freq):
    print(f"{canal}: {freq[canal]}")

cea_mai_buna = ""
cel_mai_mare = 0
for canal, contor in freq.items():
    if contor > cel_mai_mare:
        cel_mai_mare = contor
        cea_mai_buna = canal
print(f"Cel mai comun: {cea_mai_buna}")
```
