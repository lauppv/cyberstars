În lecția despre **if-else** am văzut pe scurt **True** și **False**, iar la bucle am folosit chiar **while True**. E timpul să ne uităm la ele mai cu atenție, pentru că sunt peste tot în programare

Un **boolean** este o valoare care poate fi doar unul din două lucruri: **True** sau **False**. Atât. Nicio altă opțiune

```py
este_online = True
are_cheie = False
print(este_online)
print(are_cheie)
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
are_permis = True

if varsta >= 18 and are_permis == True:
    print("Poti conduce")
else:
    print("Trebuie sa ai cel putin 18 ani si sa ai permis pentru a putea conduce")
```

Cuvântul cheie **and** spune: **ambele condiții trebuie să fie True**. Dacă măcar una dintre ele este **False**, întregul lucru este **False**

Cu alte cuvinte, dacă avem `stanga` **and** `dreapta`, trebuie ca atât `stanga` cât și `dreapta` să fie **True** pentru ca întreaga expresie să fie **True**

```py
varsta = 20
are_permis = False

if varsta >= 18 and are_permis == True:
    print("Poti conduce")
else:
    print("Trebuie sa ai cel putin 18 ani si sa ai permis pentru a putea conduce")
```

Aici **varsta >= 18** este **True**, dar **are_permis == True** este **False**. **True and False** = **False**, așa că mergem la **else**

Apropo, **are_permis == True** este același lucru cu a scrie doar **are_permis**, deoarece **are_permis** este deja un boolean. Așa că îl putem scurta

```py
if varsta >= 18 and are_permis:
    print("Poti conduce")
```

Adesea programatorii preferă să omită **== True** pentru că se subînțelege că **if are_permis** înseamnă de fapt **if are_permis == True**. Se poate și să îl punem, și să nu îl punem, ambele la fel de corecte

---

Există și **or**. Imaginează-ți: poți intra în club dacă ești **VIP SAU ai o invitație specială**. E suficient doar **unul** dintre ele

```py
este_vip = False
are_invitatie = True

if este_vip or are_invitatie:
    print("Bun venit in club")
else:
    print("Acces refuzat")
```

Chiar dacă **este_vip** este **False**, **are_invitatie** este **True**, și asta e suficient

Și, în sfârșit, **not**. **not** inversează un boolean: **not True** devine **False**, **not False** devine **True**

```py
este_autentificat = False
if not este_autentificat:
    print("Te rog autentifica-te mai intai")
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

## Booleans în bucle

Am văzut deja un boolean drept condiție: **while True** rulează cât timp condiția este... **True**. Dar putem folosi și un boolean **stocat într-o variabilă** ca să controlăm o buclă. O astfel de variabilă se numește adesea un **steag** (flag)

```py
ruleaza = True
numar = 0
while ruleaza:
    print(numar)
    numar = numar + 1
    if numar == 3:
        ruleaza = False
print("Gata")
```

Ieșire

```text
0
1
2
Gata
```

Cât timp **ruleaza** este **True**, bucla continuă. Când **if**-ul îl face **False**, condiția **while ruleaza** devine falsă și bucla se oprește la următoarea verificare. Este o alternativă curată la **break** — în loc să sărim brusc afară, lăsăm condiția să se închidă singură

---

## Misiune: Consola de comenzi

Stația are o consolă care rulează **cât timp** este pornită. Folosește o variabilă boolean `pornit` (începe cu `True`) drept condiție pentru o buclă **while**. La fiecare pas, citește o comandă cu `input()`:

- dacă utilizatorul tastează `oprire` → setează `pornit` pe `False` (bucla se va opri aici)
- dacă utilizatorul tastează `status` → afișează `Sistem activ`
- altfel → afișează `Comandă necunoscută`

După ce bucla se termină, afișează `Se închide consola...`.

**Exemplu**

Dacă utilizatorul tastează pe rând `status`, apoi `salut`, apoi `oprire`, programul afișează

```text
Sistem activ
Comanda necunoscuta
Se inchide consola...
```
