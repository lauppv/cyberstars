```py
def citeste(linii):
    for linie in linii:
        parti = linie.split(":")
        yield parti[0], int(parti[1])


flux = ["temp:21", "aer:98", "temp:23", "zgomot:4"]

senzori = {nume for nume, valoare in citeste(flux)}
ultimele = {nume: valoare for nume, valoare in citeste(flux)}
total = sum(valoare for nume, valoare in citeste(flux))

print(f"Senzori: {sorted(senzori)}")
print(f"Ultimele: {ultimele}")
print(f"Suma: {total}")
```
