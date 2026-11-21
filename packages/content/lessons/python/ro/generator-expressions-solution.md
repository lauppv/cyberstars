```py
preturi = [4, 10, 25]
bucati = [3, 0, 2]

print(f"Total: {sum(p * b for p, b in zip(preturi, bucati))}")
print(f"Cea mai mare linie: {max(p * b for p, b in zip(preturi, bucati))}")
print(f"Linii goale: {any(b == 0 for b in bucati)}")
print(f"Toate ieftine: {all(p < 20 for p, b in zip(preturi, bucati) if b > 0)}")
```
