```py
echipaj = ["Tommy", "Boris", "Cara", "Dmitri", "Cortez"]

def gaseste_echipaj(echipaj, tinta):
    for i in range(len(echipaj)):
        if echipaj[i] == tinta:
            return i
    return -1

tinta = input()
statie = gaseste_echipaj(echipaj, tinta)
if statie == -1:
    print(f"{tinta} nu este la bord")
else:
    print(f"{tinta} este la statia {statie}")
```
