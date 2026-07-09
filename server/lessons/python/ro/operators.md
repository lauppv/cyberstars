Am văzut deja că putem face **adunare** cu **+**. Dar **Python** știe mult mai mult de atât. Hai să ne uităm mai îndeaproape la ce putem face cu numerele

```py
a = 17
b = 5

print(a + b)   # adunare
print(a - b)   # scadere
print(a * b)   # inmultire
print(a / b)   # impartire
```

Ieșire

```text
22
12
85
3.4
```

Nimic prea nebunesc până acum. **+ - \*** se comportă exact ca în matematică. Singurul „interesant" este **/**, fiindcă **17 / 5** dă înapoi **3.4** (un număr cu zecimale), nu **3**

Dar dacă vrem **doar partea întreagă** a împărțirii? **17 / 5 = 3** cu un rest de **2**. Avem un operator special pentru asta

```py
a = 17
b = 5
print(a // b)   # impartire intreaga
```

Asta va afișa **3**. Am aruncat restul. **//** se numește **împărțire întreagă**

Și dacă vrem **doar restul**? Aceeași idee, alt operator

```py
a = 17
b = 5
print(a % b)   # rest (modulo)
```

Asta va afișa **2**. Operatorul **%** ne dă **restul** împărțirii. Se numește operatorul **modulo**. Nu-ți face griji de nume, doar reține ce face :)

**% este extrem de util**. De exemplu, cum știm dacă un număr este **par**? Un număr par este unul care se împarte la **2 fără rest**. Deci **n % 2 == 0** înseamnă că n este par

```py
n = 10
if n % 2 == 0:
    print("par")
else:
    print("impar")
```

Mai există un operator, folosit pentru **puteri**

```py
print(2 ** 3)   # 2 la puterea 3
```

Asta va afișa **8**, pentru că **2 _ 2 _ 2 = 8**. Operatorul **\*\*** înseamnă **putere**. Deci **5 ** 2** este **25**, **3 ** 4** este **81**, și așa mai departe

---

Un detaliu foarte important este **ordinea operațiilor**. **Python** respectă regulile matematicii: înmulțirea și împărțirea se fac înaintea adunării și scăderii

```py
print(2 + 3 * 4)    # 14, nu 20
print((2 + 3) * 4)  # 20
```

Exact ca în matematică, parantezele **()** forțează ce să se facă mai întâi. Când ai dubii, **adaugă paranteze**. Oricum fac codul mai ușor de citit

---

## Misiune: Panoul de calcul

Stația primește două numere și trebuie să afișeze rezultatul fiecărei operații. Citește două numere întregi `a` și `b` (poți presupune că `b` nu este 0), apoi afișează, câte unul pe linie, în această ordine:

- suma (`a + b`)
- diferența (`a - b`)
- produsul (`a * b`)
- împărțirea (`a / b`)
- împărțirea întreagă (`a // b`)
- restul (`a % b`)
- `a` la puterea `b` (`a ** b`)

**Exemplu**

Dacă utilizatorul tastează

```text
17
5
```

programul afișează ceva de forma

```text
22
12
85
3.4
3
2
1419857
```
