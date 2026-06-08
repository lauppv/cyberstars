În lecția despre **funcții**, toate funcțiile noastre făceau același lucru: **afișau** ceva pe ecran. Dar funcțiile pot face ceva mult mai puternic, ne pot **da înapoi o valoare** pe care o putem folosi mai târziu

Imaginează-ți: îl întreb pe un prieten „cât face 2 + 3?". Vreau să-mi **răspundă** cu **5**, nu să **strige** răspunsul la perete. Vreau să iau acel **5** și să-l folosesc pentru altceva

Asta face **return** într-o funcție

```py
def add(a, b):
    return a + b

rezultat = add(2, 3)
print(rezultat)
```

Output **5**

Ce s-a întâmplat? Funcția **add** **a luat** două numere, **a calculat** suma lor și **a returnat** rezultatul. Am prins acel rezultat în variabila **rezultat**, apoi l-am afișat

Compară asta cu stilul vechi pe care îl foloseam

```py
def addAndPrint(a, b):
    print(a + b)

addAndPrint(2, 3)
```

Asta doar afișează. Nu dă nimic înapoi. Dacă aș vrea să iau rezultatul și să-l **înmulțesc** cu 10, n-aș putea. Funcția și-a făcut treaba și valoarea s-a **dus**

Cu **return**, putem înlănțui funcții împreună

```py
def add(a, b):
    return a + b

rezultat = add(2, 3) * 10
print(rezultat)
```

Output **50**. **add(2, 3)** ne-a dat **5**, apoi am înmulțit cu **10**. Încearcă să faci asta cu o funcție care doar **afișează**, nu poți

---

O funcție poate returna **orice**, nu doar numere. Șiruri de caractere, booleeni, liste, orice

```py
def greet(nume):
    return f"Salut, {nume}!"

mesaj = greet("Cortez")
print(mesaj)
```

Output **Salut, Cortez!**

```py
def isAdult(varsta):
    return varsta >= 18

print(isAdult(20))    # True
print(isAdult(15))    # False
```

Această funcție returnează un **boolean**. Observă că putem folosi **isAdult(20)** **direct în interiorul print()**, fără să fie nevoie de o variabilă separată. **Python** rulează mai întâi funcția, apoi **print()** afișează valoarea returnată

Putem chiar să o folosim în interiorul unui **if**

```py
def isAdult(varsta):
    return varsta >= 18

varsta = 25
if isAdult(varsta):
    print("Bun venit")
else:
    print("Îmi pare rău, prea tânăr")
```

Mai curat decât să scrii **if varsta >= 18** peste tot, mai ales dacă condiția noastră se complică

---

**Important**: imediat ce **Python** vede **return**, funcția **iese imediat**. Orice e scris după **return** **NU** se execută

```py
def f():
    return 1
    print("nu se afișează niciodată")   # asta nu rulează niciodată

print(f())
```

Output este doar **1**. **print**-ul din interiorul funcției este **cod mort**, nu rulează niciodată

Putem folosi asta ca să ieșim **devreme** dintr-o funcție

```py
def divide(a, b):
    if b == 0:
        return "nu se poate împărți la zero"
    return a / b

print(divide(10, 2))    # 5.0
print(divide(10, 0))    # nu se poate împărți la zero
```

---

Apropo, o funcție care nu are **return** tot funcționează, doar că dă înapoi o valoare specială numită **None**

```py
def f():
    print("salut")

rezultat = f()
print(rezultat)
```

Output

```text
salut
None
```

**None** este modul lui **Python** de a spune „nimic". Nu trebuie să-ți faci griji pentru asta acum, doar să știi că există :)

---

## Misiune: Siguranța Reactorului

Stația are trei reactoare și ne pasă de cel mai fierbinte. Scrie o funcție `highest(a, b, c)` care **returnează** cea mai mare dintre trei citiri — folosește **if/elif/else** și **returnează** valoarea, **nu** afișa în interiorul funcției.

Apoi citește trei citiri, apelează `highest` ca să o găsești pe cea mai mare și raportează despre siguranță:

- dacă cea mai mare citire este **peste 100**, afișează `Reactor: PERICOL`
- altfel afișează `Reactor: stabil`
- pe a doua linie, afișează `Citire maximă: ` apoi valoarea cea mai mare

**Input** (tastat de utilizator când rulează programul):

- trei citiri ale reactoarelor, una pe linie

**Output**

Două linii: mesajul de siguranță, apoi cea mai mare citire.

**Exemplu**

Dacă utilizatorul tastează

```text
88
132
95
```

programul ar trebui să afișeze

```text
Reactor: PERICOL
Citire maximă: 132
```

Dacă utilizatorul tastează

```text
40
90
75
```

programul ar trebui să afișeze

```text
Reactor: stabil
Citire maximă: 90
```
