```py
def fisa(nume, **detalii):
    print(nume.upper())
    for cheie, valoare in detalii.items():
        print(f"  {cheie}: {valoare}")
    print(f"detalii: {len(detalii)}")


nume = "Ada"
info = {"rol": "inginer", "punte": 3}

fisa(nume, **info)
fisa(nume)
fisa(nume, **info, tura="zi")
```
