```py
def inverseaza_text(text):
    rezultat = ""
    for caracter in text:
        rezultat = caracter + rezultat
    return rezultat

mesaj = input()
print(f"Inversat: {inverseaza_text(mesaj)}")
cuvinte = mesaj.split(" ")
cuvinte_inversate = cuvinte[::-1]
print(f"Ordine cuvinte: {' '.join(cuvinte_inversate)}")
```
