În lecția Funcții încorporate am văzut `enumerate()`: ne dă poziția și valoarea împreună, așa că nu mai avem nevoie de `range(len(...))`. Acum vedem ce mai poate face

---

O scurtă amintire. La fiecare pas al buclei, `enumerate()` ne dă două lucruri: un număr și un element. Le prindem în două variabile

```py
echipaj = ["Ada", "Alan", "Grace"]
for i, nume in enumerate(echipaj):
    print(i, nume)
```

Rezultat

```text
0 Ada
1 Alan
2 Grace
```

---

Oamenii numără de la 1, nu de la 0. `enumerate()` poate porni de la orice număr îi dăm cu `start=`

```py
echipaj = ["Ada", "Alan", "Grace"]
for numar, nume in enumerate(echipaj, start=1):
    print(f"{numar}. {nume}")
```

Rezultat

```text
1. Ada
2. Alan
3. Grace
```

Se schimbă doar numerele. Elementele sunt aceleași și vin tot de la prima poziție a listei

---

`enumerate()` merge cu orice putem parcurge într-o buclă, și cu un string

```py
for i, litera in enumerate("moon"):
    if litera == "o":
        print("o pe pozitia", i)
```

Rezultat

```text
o pe pozitia 1
o pe pozitia 2
```

---

Cu poziția în mână, ne putem uita la elementul de dinainte. Aici găsim unde a crescut temperatura

```py
temperaturi = [20, 22, 21, 25]
for i, t in enumerate(temperaturi):
    if i > 0 and t > temperaturi[i - 1]:
        print(f"Ziua {i}: a crescut la {t}")
```

Rezultat

```text
Ziua 1: a crescut la 22
Ziua 3: a crescut la 25
```

`i > 0` vine primul, pentru că elementul de pe poziția 0 nu are nimic înaintea lui. Python citește `and` de la stânga și se oprește imediat ce o parte e falsă, așa că `temperaturi[i - 1]` nu e cerut niciodată pentru poziția 0

---

Putem folosi poziția și ca să schimbăm lista însăși

```py
puncte = [7, 12, 9]
for i, p in enumerate(puncte):
    puncte[i] = p * 10
print(puncte)
```

Rezultat

```text
[70, 120, 90]
```

Dacă am schimba doar `p`, lista ar rămâne la fel. `puncte[i] = ...` o schimbă

---

## Misiune: Recorduri personale

O alergătoare se antrenează în fiecare zi pe pista stației și își scrie distanța zilei într-o listă. O zi e un nou record personal când distanța ei e mai mare decât a tuturor zilelor dinainte. Prima zi e mereu un record personal

1. Începe programul cu o variabilă **distante**, o listă de numere întregi: metrii alergați în fiecare zi. De exemplu `distante = [800, 750, 1200, 1200, 1500]`
2. Afișează câte o linie pentru fiecare zi: `Ziua `, numărul zilei numărat de la 1, `: ` și distanța. Când ziua e un nou record personal, adaugă ` record nou` la final
3. Afișează `Zile cu record: ` și câte zile au fost un nou record personal

Folosește `enumerate()`, nu `range()`. **distante** are între 1 și 30 de zile, fiecare de la 0 la 50000 de metri

**Exemplu** pentru distante = [800, 750, 1200, 1200, 1500]

```text
Ziua 1: 800 record nou
Ziua 2: 750
Ziua 3: 1200 record nou
Ziua 4: 1200
Ziua 5: 1500 record nou
Zile cu record: 3
```

Ziua 4 nu e un record nou: 1200 e la fel cu cel mai bun de până atunci, nu mai mare
