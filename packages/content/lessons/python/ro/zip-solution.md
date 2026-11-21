```py
nume = ["Kai", "Mila", "Tom"]
inainte = [60, 75, 80]
dupa = [72, 70, 95]

cel_mai_bun = ""
cea_mai_mare = -101
for n, primul, ultimul in zip(nume, inainte, dupa):
    schimbare = ultimul - primul
    print(f"{n}: {primul} -> {ultimul} ({schimbare:+})")
    if schimbare > cea_mai_mare:
        cea_mai_mare = schimbare
        cel_mai_bun = n
print(f"Cel mai mare progres: {cel_mai_bun}")
```
