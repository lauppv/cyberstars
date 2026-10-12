```py
varsta = 8
este_3d = True

pret = 10

if varsta < 6:
    reducere = 10
elif varsta <= 12:
    reducere = 5
elif varsta <= 17:
    reducere = 3
elif varsta <= 64:
    reducere = 0
else:
    reducere = 4

total = pret - reducere

print(f"Pret standard: {pret} EUR")
print(f"Reducere: {reducere} EUR")
if este_3d:
    total = total + 2
    print("Taxa 3D: 2 EUR")
print(f"Total: {total} EUR")
```
