Două treburi apar mereu cu listele: să schimbăm fiecare element la fel și să păstrăm doar elementele pe care le vrem. Python are câte o funcție încorporată pentru fiecare: `map()` și `filter()`. Amândouă primesc o funcție, de multe ori o lambda, și o listă

---

`map()` apelează funcția pe fiecare element și ne dă rezultatele. Ca să le vedem ca listă, punem `list()` în jurul lui

```py
metri = [1500, 300, 42000]
kilometri = list(map(lambda m: m / 1000, metri))
print(kilometri)
```

Rezultat

```text
[1.5, 0.3, 42.0]
```

Merge orice funcție, nu doar o lambda. `map(str, numere)` transformă fiecare număr într-un string, util înainte de `join()`

```py
numere = [3, 1, 4]
print("-".join(map(str, numere)))
```

Rezultat

```text
3-1-4
```

---

`filter()` apelează funcția pe fiecare element și păstrează doar elementele pentru care ea întoarce True

```py
varste = [12, 30, 17, 45, 18]
adulti = list(filter(lambda v: v >= 18, varste))
print(adulti)
```

Rezultat

```text
[30, 45, 18]
```

Elementele păstrate nu se schimbă și rămân în aceeași ordine

---

Le putem pune împreună: întâi păstrăm unele elemente, apoi le schimbăm

```py
cuvinte = ["luna", "soare", "cometa", "stea"]
lungi = filter(lambda c: len(c) > 4, cuvinte)
print(list(map(lambda c: c.upper(), lungi)))
```

Rezultat

```text
['SOARE', 'COMETA']
```

---

`map()` și `filter()` nu fac o listă pe loc. Dau elementele câte unul, când le cere cineva, și o singură dată. De asta folosim `list()` ca să le vedem, și de asta un al doilea `list()` din același rezultat e gol

```py
dublate = map(lambda x: x * 2, [1, 2])
print(list(dublate))
print(list(dublate))
```

Rezultat

```text
[2, 4]
[]
```

List comprehension, pe care l-am cunoscut mai devreme, poate face aceleași treburi: `[m / 1000 for m in metri]`. Folosește varianta care ți se pare mai ușor de citit. Mulți programatori Python aleg un comprehension când ar avea nevoie de o lambda și `map()` când funcția există deja, ca `str`

---

## Misiune: Punctele fierbinți

Senzorii stației trimit temperaturile în zecimi de grad, ca numere întregi: `215` înseamnă 21.5 grade. Inginerii le vor în grade și o listă cu locurile prea calde

1. Începe programul cu două variabile: **citiri**, o listă de numere întregi, și **limita**, un număr întreg de grade. De exemplu `citiri = [215, 380, 199, 402]` și `limita = 30`
2. Afișează `Grade: ` și lista citirilor în grade, folosind `map()`. Împarte la 10: înmulțirea cu 0.1 dă numere ca `19.900000000000002`, pentru că un calculator nu poate păstra 0.1 exact
3. Afișează `Prea cald: ` și lista citirilor în grade care sunt mai mari decât limita, folosind `filter()`
4. Afișează `Numar: ` și câte citiri sunt prea calde

**citiri** are între 1 și 30 de citiri, fiecare de la -500 la 1000, iar **limita** e de la -50 la 100

**Exemplu** pentru citiri = [215, 380, 199, 402] și limita = 30

```text
Grade: [21.5, 38.0, 19.9, 40.2]
Prea cald: [38.0, 40.2]
Numar: 2
```
