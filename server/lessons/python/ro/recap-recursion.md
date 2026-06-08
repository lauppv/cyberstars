Combină **recursivitatea**, **matricele (liste 2D)** și **căutarea binară**

---

## Misiune: Scanarea Sectorului

O scanare pe rază lungă întoarce o **hartă a sectorului** sub forma unei grile 2D (o listă de liste, deja în dreapta) unde:

- **0** = spațiu liber
- **1** = resturi
- **2** = far

Adună tot din acest capitol — **matrice**, **recursivitate** și **căutare binară**:

**count_beacons(sector)** — folosește **bucle imbricate** pe grilă ca să numeri câte faruri (`2`-urile) conține.

**flatten_sorted(sector)** — restrânge grila 2D într-o **listă sortată cu valorile unice** care apar în ea.

**find_value(sorted_list, tinta)** — folosește **căutare binară recursivă** ca să verifici dacă o valoare se află în lista sortată. Întoarce `True` sau `False`.

Testează cu:

```py
print(f"Faruri: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Valori unice: {flat}")
print(f"Are valoare far: {find_value(flat, 2)}")
print(f"Are valoarea 3: {find_value(flat, 3)}")
```

**Output**

```text
Faruri: 1
Valori unice: [0, 1, 2]
Are valoare far: True
Are valoarea 3: False
```
