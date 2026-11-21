```py
cuvant = "moon"

coduri = []
oglinda = ""
for litera in cuvant:
    coduri.append(str(ord(litera)))
    oglinda = oglinda + chr(ord("a") + ord("z") - ord(litera))

print(f"Coduri: {' '.join(coduri)}")
print(f"Oglinda: {oglinda}")
```
