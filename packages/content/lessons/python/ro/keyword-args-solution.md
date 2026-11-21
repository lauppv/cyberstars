```py
def rezerva(nume, destinatie, locuri=1, geam=False):
    linie = f"{nume} -> {destinatie}, locuri {locuri}"
    if geam:
        linie = linie + ", geam"
    return linie


nume = "Ada"
destinatie = "Marte"
locuri = 2
geam = True

print(rezerva(geam=geam, nume=nume, locuri=locuri, destinatie=destinatie))
print(rezerva(nume=nume, destinatie="Luna"))
```
