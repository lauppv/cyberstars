Combină **recursivitatea**, **matricele (liste 2D)** și **căutarea binară**

---

## Misiune: Scanarea Sectorului

O scanare pe rază lungă întoarce o **hartă a sectorului** sub forma unei grile 2D (o listă de liste) unde:

- **0** = spațiu liber
- **1** = resturi
- **2** = far

Adună tot din acest capitol — **matrice**, **recursivitate** și **căutare binară**:

**numara_balize(sector)** — folosește **bucle imbricate** pe grilă ca să numeri câte faruri (`2`-urile) conține.

**aplatizeaza_sortat(sector)** — restrânge grila 2D într-o **listă sortată cu valorile unice** care apar în ea.

**gaseste_valoare(lista_sortata, tinta)** — folosește **căutare binară recursivă** ca să verifici dacă o valoare se află în lista sortată. Întoarce `True` sau `False`.

Testează cu:

```py
print(f"Faruri: {numara_balize(sector)}")
plat = aplatizeaza_sortat(sector)
print(f"Valori unice: {plat}")
print(f"Are valoare far: {gaseste_valoare(plat, 2)}")
print(f"Are valoarea 3: {gaseste_valoare(plat, 3)}")
```

**Ieșire**

```text
Faruri: 1
Valori unice: [0, 1, 2]
Are valoare far: True
Are valoarea 3: False
```
