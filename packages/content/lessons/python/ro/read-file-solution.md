```py
stoc = ["orez,12", "sare,3", "ceai,40"]

f = open("stoc.txt", "w")
for linie in stoc:
    f.write(linie + "\n")
f.close()

f = open("stoc.txt")
linii = f.read().splitlines()
f.close()

total = 0
cel_mai_mult = ""
maxim = -1
for linie in linii:
    nume, bucati = linie.split(",")
    total += int(bucati)
    if int(bucati) > maxim:
        maxim = int(bucati)
        cel_mai_mult = nume

print(f"Produse: {len(linii)}")
print(f"Total: {total}")
print(f"Cele mai multe: {cel_mai_mult}")

try:
    f = open("vechi.txt")
    print(f"vechi.txt: {len(f.read().splitlines())}")
    f.close()
except FileNotFoundError:
    print("vechi.txt: lipseste")
```
