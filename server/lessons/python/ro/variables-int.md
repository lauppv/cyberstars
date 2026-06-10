Așa cum putem stoca o bucată de text într-o variabilă, putem stoca și numere

```py
varsta = 18
x = 1
print(varsta)
print(x)
```

Cu numerele putem efectua operații

```py
a = 2
b = 6
c = a + b
print(c)
```

c = a + b este foarte important de înțeles. Dacă avem semnul **=**, ceea ce se află în **partea dreaptă se execută întotdeauna primul**, apoi rezultatul este stocat în ceea ce se află în partea stângă

```text
x = 23 + 22
```

aici 23 + 22 se face mai întâi. rezultatul 45 este luat și stocat în variabila **x**

Foarte des întâlnit în programare este **incrementarea cu 1**, adică

```py
n = 10
n = n + 1
print(n)
```

De ce se afișează 11? Sau, mai bine zis, de ce rulează programul? De ce nu se prăbușește? Cum adică n = n + 1? Matematic nu are niciun sens
Ei bine, în programare are sens. Am spus deja că dacă avem un semn egal, **Python face mai întâi ce se află în dreapta**, apoi stochează rezultatul în ce se află în stânga

```text
n = n + 1
```

Aici se uită în dreapta semnului = și vede n + 1, adică 10 + 1, care este 11, și îl stochează în variabila n

Apropo, 1, 2, 5, -1, -2019, 2025, 1235123, 0, toate acestea sunt **numere întregi** (integers)
Există și numere **cu virgulă mobilă** (floating-point), adică cu zecimale, precum 3.14 sau -15.6

```py

pi = 3.14159
k = 33

print(pi + k)
```

asta afișează `text 36.159`

---

## Misiune: Numărătoarea Oxigenului

Stația are trei rezervoare de oxigen, cu cantitățile lor (în litri) stocate în `tank_a`, `tank_b` și `tank_c`.

Adună cele trei rezervoare laolaltă într-un `total` și afișează-l. Apoi o scurgere golește **50** de litri — scade 50 din `total` și afișează noua valoare.

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `tank_a`, `tank_b`, `tank_c` — litri de oxigen din fiecare rezervor

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
400
350
```
