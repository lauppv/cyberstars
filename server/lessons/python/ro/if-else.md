În viața reală, suntem deseori puși în fața unei decizii: ori fac asta, ori fac aia. Dacă afară sunt mai puțin de 15 grade, am nevoie de o bluză, altfel un tricou e suficient. Dacă mi-e somn, mă duc la culcare, altfel programez **:)** Așadar observăm 2 ramuri:

**if** da

**if** nu (**else**)

În programare, spunem

**if** e frig (temperatura e mai mică de 15 grade):
ia o bluză

**else**:
un tricou e suficient

```py
temperatura = 14
if temperatura < 15:
    print("Ia o bluza")
else:
    print("Un tricou e suficient")
```

Asta e ca o poveste:
**dacă temperatura de afară este mai mică de 15 grade Celsius**, am nevoie de o bluză

**Altfel**, ajunge un tricou

După **if** și **else**, punem două puncte **:**

Apoi tot ce scriem după aceste **:** trebuie să fie **indentat**. De ce? Ca Python să știe care linii de cod aparțin blocului **if** și care nu, și la fel pentru **else**

```py
temperatura = 14
if temperatura < 15:
print("Ia o bluza")
else:
print("Un tricou e suficient")
```

Rulează codul. Poți vedea eroarea. Apropo, încearcă să **citești erorile** pentru că îți spun exact ce ai greșit

Semnul **<** înseamnă mai mic decât. Dacă temperatura este mai mică de 15: 14, 10, 0, etc

În mod similar, avem:

**<=** înseamnă mai mic sau egal cu 15: 15, 14, 10, 0, -12

**>** înseamnă mai mare decât 15: 16, 20, 145

**>=** înseamnă mai mare sau egal cu 15: 15, 16, 20, 1000

**==** înseamnă egal. Nu îl confunda cu **=** care este folosit ca să **atribui** o valoare unei variabile

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

Totuși, există cazuri în care chiar avem nevoie de **else**. **Dacă** iau cel puțin 50% la un examen, trec, **altfel** nu trec. Aici vedem că există două posibilități: ori treci, ori nu treci. Nu e ca și cum aici poți spune 'dacă iau 50% trec, dacă nu, nu se întâmplă nimic' — se întâmplă să pici examenul, adică există o consecință

```py
utilizator = "Tommy Vercetti"
este_utilizator_online = True

if este_utilizator_online == True:
    print(f"{utilizator} joaca GTA Vice City")
else:
    print(f"{utilizator} este offline")
```

**True** și **False** sunt destul de simple. **Dacă** utilizatorul este **online**, intrăm în blocul **if** și **NU** vom intra în **else**. Putem vedea că codul din blocul **else** nu se execută. Schimbă **is_user_online** în **False** și rulează codul. Ce vezi?

```py
utilizator = "Tommy Vercetti"
este_utilizator_online = False

if este_utilizator_online == True:
    print(f"{utilizator} joaca GTA Vice City")
else:
    print(f"{utilizator} este offline")
```

Aici vedem că utilizatorul este **offline** pentru că **is_user_online** = **False**, ceea ce înseamnă că nu vom intra în blocul **if**, din moment ce intrăm doar **dacă** condiția este **adevărată**. Pentru că condiția noastră este **falsă**, intrăm în blocul **else**

---

## Misiune: Supravegherea Reactorului

Reactorul își raportează temperatura în `temperatura` (grade Celsius). Scrie un **if / else** care o verifică:

- dacă `temperatura` este **mai mare de 1000** → afișează `Pericol: reactor la`, temperatura, apoi `grade - oprire` (pentru `temperatura = 1200` asta înseamnă `Pericol: reactor la 1200 grade - oprire`)
- altfel → afișează `Reactor stabil la`, temperatura, apoi `grade` (pentru `temperatura = 800` asta înseamnă `Reactor stabil la 800 grade`)

Creează o variabilă care să stocheze temperatura

Ai putea crea variabila `temperatura`. În realitate, poți crea și variabila `x`, dar se recomandă nume descriptive. Dacă altcineva vede `x`, atunci automat se va întreba 'cum adică x? Cine este x?'. Noi recomandăm `temperatura`

**Exemplu**

Cu `temperatura = 1200`, programul tău ar trebui să afișeze

```text
Pericol: reactor la 1200 grade - oprire
```

Acum setează `temperatura = 800` și rulează din nou

```text
Reactor stabil la 800 grade
```

Cu `temperatura = 1000`, programul tău ar trebui să afișeze

```text
Reactor stabil la 1000 grade
```

De ce reactorul este stabil la temperatura = 1000?
