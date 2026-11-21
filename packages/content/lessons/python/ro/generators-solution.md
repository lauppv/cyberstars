```py
def arde(combustibil, rata):
    while combustibil - rata >= 0:
        combustibil -= rata
        yield combustibil


combustibil = 10
rata = 3

print(f"Primul: {next(arde(combustibil, rata), 'niciunul')}")
pulsuri = 0
for puls, ramas in enumerate(arde(combustibil, rata), start=1):
    print(f"Puls {puls}: {ramas}")
    pulsuri = puls
print(f"Pulsuri: {pulsuri}")
```
