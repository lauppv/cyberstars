```py
semnale = ["A1", "B2", "A1", "C3", "B2", "A1", "D4", "C3"]

print(f"Total: {len(semnale)}")

unice = set(semnale)
print(f"Unice: {len(unice)}")

if "D4" in unice:
    print("D4 detectat")
else:
    print("D4 lipseste")
```
