În lecția despre **if-else** am văzut pe scurt **True** și **False**. E timpul să ne uităm la ele mai cu atenție, pentru că sunt peste tot în programare

Un **boolean** este o valoare care poate fi doar unul din două lucruri: **True** sau **False**. Atât. Nicio altă opțiune

```py
isOnline = True
hasKey = False
print(isOnline)
print(hasKey)
```

**Atenție**: **True** și **False** se scriu **cu literă mare**. **true** și **false** vor da o eroare în Python

Știm deja că condiții precum **varsta < 18** sau **x == 5** sunt verificate de **if**. Ei bine, acele condiții sunt de fapt **booleans** deghizate

```py
varsta = 20
print(varsta < 18)     # False
print(varsta >= 18)    # True
```

Încearcă. **Python** chiar afișează **True** sau **False**

---

Până aici, bine. Dar dacă vrem să combinăm mai multe condiții? Imaginează-ți o poveste: pentru a conduce o mașină, trebuie să ai **cel puțin 18 ani ȘI să ai permis**. Ambele trebuie să fie adevărate în același timp

```py
varsta = 20
hasLicense = True

if varsta >= 18 and hasLicense == True:
    print("Poți conduce")
else:
    print("Scuze, azi nu conduci")
```

Cuvântul cheie **and** spune: **ambele condiții trebuie să fie True**. Dacă măcar una dintre ele este **False**, întregul lucru este **False**

```py
varsta = 20
hasLicense = False

if varsta >= 18 and hasLicense == True:
    print("Poți conduce")
else:
    print("Scuze, azi nu conduci")
```

Aici **varsta >= 18** este **True**, dar **hasLicense == True** este **False**. **True and False** = **False**, așa că mergem la **else**

Apropo, **hasLicense == True** este același lucru cu a scrie doar **hasLicense**, deoarece **hasLicense** este deja un boolean. Așa că îl putem scurta

```py
if varsta >= 18 and hasLicense:
    print("Poți conduce")
```

Mai curat :)

---

Există și **or**. Imaginează-ți: poți intra în club dacă ești **VIP SAU ai o invitație specială**. E suficient doar **unul** dintre ele

```py
isVIP = False
hasInvitation = True

if isVIP or hasInvitation:
    print("Bun venit în club")
else:
    print("Acces refuzat")
```

Chiar dacă **isVIP** este **False**, **hasInvitation** este **True**, și asta e suficient

Și, în sfârșit, **not**. **not** inversează un boolean: **not True** devine **False**, **not False** devine **True**

```py
isLoggedIn = False
if not isLoggedIn:
    print("Te rog autentifică-te mai întâi")
```

Se citește aproape ca în limba română: _dacă nu este autentificat, te rog autentifică-te_

---

Un mic rezumat, **tabelele de adevăr**

```text
True  and True  = True
True  and False = False
False and True  = False
False and False = False

True  or  True  = True
True  or  False = True
False or  True  = True
False or  False = False

not True  = False
not False = True
```

---

## Misiune: Acces la HQ

Scrii sistemul de uși pentru **CyberStars HQ**. O persoană poate intra dacă este **angajat ȘI este zi lucrătoare**, sau dacă este **oaspete care are o invitație**.

Programul pune **patru** întrebări. Pentru fiecare, utilizatorul tastează `yes` sau `no`. Un truc util: `answer == "yes"` este deja un boolean, așa că îl poți stoca direct într-o variabilă.

**Input** (tastat de utilizator când rulează programul), fiecare `yes` sau `no`:

- persoana este angajat?
- este zi lucrătoare?
- persoana este oaspete?
- persoana are o invitație?

**Output**

O linie: `Acces permis` dacă persoana poate intra, altfel `Acces refuzat`.

**Exemplu**

Dacă utilizatorul tastează

```text
yes
yes
no
no
```

programul ar trebui să afișeze

```text
Acces permis
```

Un oaspete cu o invitație intră și el. Dacă utilizatorul tastează

```text
no
no
yes
yes
```

programul ar trebui să afișeze

```text
Acces permis
```
