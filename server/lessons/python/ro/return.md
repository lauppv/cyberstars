În lecția despre **funcții**, toate funcțiile noastre făceau același lucru: **afișau** ceva pe ecran. Dar funcțiile pot face ceva mult mai puternic, ne pot **da înapoi o valoare** pe care o putem folosi mai târziu

Imaginează-ți: îl întreb pe un prieten „cât face 2 + 3?". Vreau să-mi **răspundă** cu **5**, nu să **strige** răspunsul la perete. Vreau să iau acel **5** și să-l folosesc pentru altceva

Asta face **return** într-o funcție

```py
def adauga(a, b):
    return a + b

rezultat = adauga(2, 3)
print(rezultat)
```

Output **5**

Ce s-a întâmplat? Funcția **add** **a luat** două numere, **a calculat** suma lor și **a returnat** rezultatul. Am prins acel rezultat în variabila **rezultat**, apoi l-am afișat

Compară asta cu stilul vechi pe care îl foloseam

```py
def adauga_si_afiseaza(a, b):
    print(a + b)

adauga_si_afiseaza(2, 3)
```

Asta doar afișează. Nu dă nimic înapoi. Dacă aș vrea să iau rezultatul și să-l **înmulțesc** cu 10, n-aș putea. Funcția și-a făcut treaba și valoarea s-a **dus**

Cu **return**, putem înlănțui funcții împreună

```py
def adauga(a, b):
    return a + b

rezultat = adauga(2, 3) * 10
print(rezultat)
```

Output **50**. **add(2, 3)** ne-a dat **5**, apoi am înmulțit cu **10**. Încearcă să faci asta cu o funcție care doar **afișează**, nu poți

---

Adevăratul rost al unei funcții e că scrii logica **o singură dată** și apoi o folosești de **câte ori vrei**, cu argumente diferite. Nu mai repeți codul din corp

Imaginează-ți că avem trei senzori care ne dau temperatura în **Celsius**, dar noi o vrem în **Fahrenheit**. Fără funcție, am repeta aceeași formulă de fiecare dată

```py
senzor1 = 20 * 9 / 5 + 32
senzor2 = 37 * 9 / 5 + 32
senzor3 = 100 * 9 / 5 + 32
print(senzor1)
print(senzor2)
print(senzor3)
```

Aceeași formulă, scrisă de **trei ori**. Dacă greșim ceva la ea, trebuie s-o corectăm în toate locurile. Și dacă am avea **o sută** de senzori?

Cu o funcție, scriem formula **o singură dată** în corpul ei și apoi o **apelăm** cu argumente diferite

```py
def in_fahrenheit(c):
    return c * 9 / 5 + 32

print(in_fahrenheit(20))
print(in_fahrenheit(37))
print(in_fahrenheit(100))
```

Ieșire

```text
68.0
98.6
212.0
```

Corpul funcției — formula — e scris **o singură dată**. Îl refolosim de trei ori, schimbând doar **argumentul**. Asta e, până la urmă, ce ne dă o funcție: scrii codul o dată și nu-l mai repeți

---

O funcție poate returna **orice**, nu doar numere. Șiruri de caractere, booleeni, liste, orice

```py
def saluta(nume):
    return f"Salut, {nume}!"

mesaj = saluta("Cortez")
print(mesaj)
```

Output **Salut, Cortez!**

```py
def este_adult(varsta):
    return varsta >= 18

print(este_adult(20))    # True
print(este_adult(15))    # False
```

Această funcție returnează un **boolean**. Observă că putem folosi **is_adult(20)** **direct în interiorul print()**, fără să fie nevoie de o variabilă separată. **Python** rulează mai întâi funcția, apoi **print()** afișează valoarea returnată

Putem chiar să o folosim în interiorul unui **if**

```py
def este_adult(varsta):
    return varsta >= 18

varsta = 25
if este_adult(varsta):
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
def imparte(a, b):
    if b == 0:
        return "nu se poate împărți la zero"
    return a / b

print(imparte(10, 2))    # 5.0
print(imparte(10, 0))    # nu se poate împărți la zero
```

---

Apropo, o funcție care nu are **return** tot funcționează, doar că dă înapoi o valoare specială numită **None**

```py
def f():
    print("salut")

rezultat = f()
print(rezultat)
```

Ieșire

```text
salut
None
```

**None** este modul lui **Python** de a spune „nimic". Nu trebuie să-ți faci griji pentru asta acum, doar să știi că există :)

---

## Misiune: Atlasul Galaxiilor

În editor ai deja **cinci galaxii**, fiecare o **listă** cu zece nume de stele.

Scrie **o singură** funcție care primește o galaxie (lista) și **returnează** numele stelei cu cele mai multe litere din acea galaxie.

Apoi **apeleaz-o de cinci ori**, o dată pentru fiecare galaxie, și afișează ce returnează. Scrii funcția o dată, dar o folosești pentru toate cele cinci liste — fără să repeți codul din corp.

**Ieșire**

Cinci linii, câte un nume pe linie: cea mai lungă stea din fiecare galaxie, în ordine.

**Exemplu**

Dacă o galaxie ar fi `["rigel", "vega", "betelgeuse", "spica"]`, funcția ar returna `betelgeuse`.

Pentru galaxiile din editor, programul ar trebui să afișeze

```text
betelgeuse
bellatrix
fomalhaut
rasalhague
vindemiatrix
```
