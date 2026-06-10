În viața reală, suntem deseori puși în fața unei decizii: ori fac asta, ori fac aia. Dacă afară e frig, am nevoie de un pulover, altfel un tricou e suficient. Dacă mi-e somn, mă duc la culcare, altfel programez **:)** Așadar observăm 2 ramuri:

**if** da

**if** nu (**else**)

În programare, spunem

**if** e frig:
ia un pulover

**else**:
ia un tricou

```py
varsta = 18
if varsta < 18:
    print("Acces refuzat pentru că nu ai 18 ani")
else:
    print("Bun venit în club")
```

Asta e ca o poveste:
**dacă vârsta este mai mică de 18**, nu au voie să intre

**Altfel**, înseamnă că au 18 ani sau mai mult, deci pot intra

După **if** și **else**, punem două puncte **:**

Apoi tot ce scriem după aceste **:** trebuie să fie **indentat**. De ce? Ca Python să știe care linii de cod aparțin blocului **if** și care nu, și la fel pentru **else**

```py
varsta = 18
if varsta < 18:
print("Acces refuzat pentru că nu ai 18 ani")
else:
print("Bun venit în club")
```

Rulează codul. Poți vedea eroarea. Apropo, încearcă să **citești erorile** pentru că îți spun exact ce ai greșit

Semnul **<** înseamnă mai mic decât. Dacă vârsta este mai mică de 18: 17, 15, 10, etc

În mod similar, avem:

**<=** înseamnă mai mic sau egal cu 18: 18, 17, 15, 4, 0, -12

**>** înseamnă mai mare decât 18: 19, 20, 145

**>=** înseamnă mai mare sau egal cu 18: 18, 19, 20, 1000

**==** înseamnă egal. Nu îl confunda cu **=** care este folosit ca să
**atribui** o valoare unei variabile

```py
x = 4
if x = 4:
    print("Bau")
```

Asta va genera o eroare. Modul corect este

```py
x = 4
if x == 4:
    print("Bau")
```

Apropo, nu avem mereu nevoie de un **else** după **if**. Hai să ne gândim la o mașină. **Dacă** întoarcem cheia, motorul pornește, **altfel** nu se întâmplă nimic. Aici, nu avem neapărat nevoie de un **else**

Totuși, există cazuri în care chiar avem nevoie de **else**. **Dacă** iau cel puțin 50% la un examen, trec, **altfel** nu trec. Aici vedem că există două posibilități: ori treci, ori nu treci

```py
utilizator = "Tommy Vercetti"
este_utilizator_online = True

if este_utilizator_online == True:
    print(f"{utilizator} joacă GTA Vice City")
else:
    print(f"{utilizator} este offline")
```

**True** și **False** sunt destul de simple. **Dacă** utilizatorul este **online**, intrăm în blocul **if** și **NU** vom intra în **else**. Putem vedea că codul din blocul **else** nu se execută. Schimbă **is_user_online** în **False** și rulează codul. Ce vezi?

```py
utilizator = "Tommy Vercetti"
este_utilizator_online = False

if este_utilizator_online == True:
    print(f"{utilizator} joacă GTA Vice City")
else:
    print(f"{utilizator} este offline")
```

Aici vedem că utilizatorul este **offline** pentru că **is_user_online** = **False**, ceea ce înseamnă că nu vom intra în blocul **if**, din moment ce intrăm doar **dacă** condiția este **adevărată**. Pentru că condiția noastră este **falsă**, intrăm în blocul **else**

---

## Misiune: Supravegherea Reactorului

Reactorul își raportează temperatura în `temperatura` (grade Celsius). Scrie un **if / else** care o verifică:

- dacă `temperatura` este **mai mare de 1000** → afișează `PERICOL: reactor la`, temperatura, apoi `grade - oprire` (pentru `temperatura = 1200` asta înseamnă `PERICOL: reactor la 1200 grade - oprire`)
- altfel → afișează `Reactor stabil la`, temperatura, apoi `grade` (pentru `temperatura = 800` asta înseamnă `Reactor stabil la 800 grade`)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `temperatura` — temperatura reactorului în grade Celsius

**Exemplu**

Cu `temperatura = 1200`, programul tău ar trebui să afișeze

```text
PERICOL: reactor la 1200 grade - oprire
```

Acum setează `temp = 800` și rulează din nou

```text
Reactor stabil la 800 grade
```

Aici la **CyberStars** încurajăm **curiozitatea** — schimbă `temperatura` și vezi ce se întâmplă :)
