În lecția Dicționar de frecvențe am numărat lucruri de mână cu un dicționar. Treaba asta e atât de des întâlnită încât Python are unelte gata făcute pentru ea, în modulul `collections`. Întâi, o mică metodă a dicționarelor care ajută și ea la numărat: `.get()`

---

Dacă citim o cheie care nu e în dicționar, programul se oprește cu un KeyError. `.get(cheie, implicit)` ne dă înapoi valoarea implicită în loc

```py
luni = {"Pamant": 1, "Marte": 2}
print(luni.get("Marte", 0))
print(luni.get("Venus", 0))
```

Rezultat

```text
2
0
```

Cu ea, numărarea încape într-o linie: `numarari[cuvant] = numarari.get(cuvant, 0) + 1`

---

`Counter` face toată numărătoarea pentru noi. Dă-i o listă sau un string și numără de câte ori e acolo fiecare element

```py
from collections import Counter

voturi = ["pizza", "supa", "pizza", "salata", "pizza", "supa"]
numarari = Counter(voturi)
print(numarari["pizza"])
print(numarari["tort"])
print(numarari.most_common(2))
```

Rezultat

```text
3
0
[('pizza', 3), ('supa', 2)]
```

Un `Counter` merge ca un dicționar, dar un element care lipsește are 0 în loc de o eroare. `.most_common(n)` dă cele mai des întâlnite `n` elemente cu numărul lor, ca perechi, întâi cel cu numărul cel mai mare. Elementele cu același număr rămân în ordinea în care au apărut prima oară

---

`defaultdict` e un dicționar care își face singur o valoare prima dată când e folosită o cheie. Îi spunem ce fel de valoare: `list` pentru o listă goală, `int` pentru 0

```py
from collections import defaultdict

cuvinte = ["soare", "stea", "luna", "sud", "lac"]
dupa_litera = defaultdict(list)
for cuvant in cuvinte:
    dupa_litera[cuvant[0]].append(cuvant)
print(dupa_litera["s"])
print(dupa_litera["l"])
print(len(dupa_litera))
```

Rezultat

```text
['soare', 'stea', 'sud']
['luna', 'lac']
2
```

Cu un dicționar obișnuit, `dupa_litera["s"].append(...)` ar da eroare prima dată, pentru că încă nu există o listă. `defaultdict(list)` face una pe loc. Ăsta e felul clasic de a pune elemente în grupuri

---

`defaultdict(int)` pornește fiecare cheie nouă de la 0, încă un fel de a număra

```py
from collections import defaultdict

totaluri = defaultdict(int)
for produs, kilograme in [("orez", 5), ("sare", 1), ("orez", 3)]:
    totaluri[produs] += kilograme
print(dict(totaluri))
```

Rezultat

```text
{'orez': 8, 'sare': 1}
```

`dict()` îl transformă într-un dicționar obișnuit, ca să se afișeze ca de obicei

---

## Misiune: Numărătoarea cuvintelor

Jurnalul radio al stației e o linie lungă de cuvinte. Echipajul vrea să știe ce cuvinte apar cel mai des și să vadă cuvintele grupate după prima literă

1. Începe programul cu o variabilă **text**, un string de cuvinte cu litere mici, cu un spațiu între ele. De exemplu `text = "mergem la luna si la stele si inapoi"`
2. Afișează `Cuvinte: ` și câte cuvinte are textul, și `Diferite: ` și câte cuvinte diferite are
3. Afișează `Top: ` și cele mai des întâlnite 3 cuvinte cu numărul lor, ca `la 2, si 2, mergem 1`. Cu mai puțin de 3 cuvinte diferite, afișează-le pe toate. Cuvintele cu același număr merg în ordinea în care apar prima oară
4. Pentru fiecare primă literă, de la a la z, afișează litera, `: ` și cuvintele diferite care încep cu ea, unite cu ` `, în ordinea în care apar prima oară

Folosește `Counter` și `defaultdict`. **text** are între 1 și 30 de cuvinte

**Exemplu** pentru text = "mergem la luna si la stele si inapoi"

```text
Cuvinte: 8
Diferite: 6
Top: la 2, si 2, mergem 1
i: inapoi
l: la luna
m: mergem
s: si stele
```
