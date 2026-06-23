Știm deja ce face o buclă **for**. Dar ce se întâmplă dacă punem o **buclă în interiorul altei bucle**? Asta se numește **buclă imbricată** și este unul dintre acele lucruri care par confuze la început, dar devin a doua natură odată ce le vezi în acțiune

Să începem simplu. Vrem să afișăm toate combinațiile a două aruncări de zaruri

```py
for zar1 in range(1, 7):
    for zar2 in range(1, 7):
        print(f"{zar1} {zar2}")
```

Asta va afișa **36 de linii**: (1,1), (1,2), ..., (1,6), (2,1), (2,2), ... până la (6,6)

Cum funcționează? **Bucla exterioară** începe cu **die1 = 1**. Apoi **bucla interioară** rulează complet de la **die2 = 1** până la **die2 = 6**. După ce bucla interioară se termină, bucla exterioară trece la **die1 = 2**, iar bucla interioară rulează din nou de la zero. Și așa mai departe

Gândește-te ca la un ceas: **bucla interioară** este acul minutar (merge repede, rotație completă), **bucla exterioară** este acul orar (se mișcă doar după ce acul minutar termină un ciclu complet)

---

O utilizare foarte frecventă: afișarea unei **tabele de înmulțire**

```py
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i} x {j} = {i * j}")
    print("---")
```

**print("---")** este în interiorul buclei exterioare, dar **în afara** buclei interioare, așa că se afișează după fiecare „rând" de înmulțiri. Fii atent la **indentare**, contează foarte mult aici

---

Putem folosi bucle imbricate și cu **liste**

```py
echipe = ["Sharks", "Bears"]
jucatori = ["Tommy", "Lance", "Cortez"]

for echipa in echipe:
    for jucator in jucatori:
        print(f"{jucator} joaca pentru {echipa}")
```

Ieșire

```text
Tommy joaca pentru Sharks
Lance joaca pentru Sharks
Cortez joaca pentru Sharks
Tommy joaca pentru Bears
Lance joaca pentru Bears
Cortez joaca pentru Bears
```

Fiecare jucător este împerecheat cu fiecare echipă. Bucla exterioară alege o echipă, iar bucla interioară parcurge toți jucătorii pentru acea echipă

---

**break** în interiorul unei bucle imbricate oprește doar bucla **interioară**, nu și pe cea exterioară

```py
for i in range(1, 4):
    for j in range(1, 4):
        if j == 2:
            break
        print(f"{i} {j}")
```

Ieșire

```text
1 1
2 1
3 1
```

Când **j** ajunge la **2**, **break** oprește bucla interioară, dar bucla exterioară continuă la următorul **i**

---

## Misiune: Turnul de Semnal

Construiește un turn de steluțe pentru antena stației. **Citește** un număr `rows`, apoi afișează un triunghi dreptunghic unde primul rând are **1** steluță, al doilea are **2**, și așa mai departe, până la `rows` rânduri.

Bucla exterioară controlează **rândul**, iar bucla interioară afișează numărul corect de **steluțe** pentru acel rând. Folosește `print("*", end="")` ca să afișezi o steluță **fără** să treci la o linie nouă, apoi `print()` singur după bucla interioară ca să treci la linia următoare.

**Intrare** (tastat de utilizator când rulează programul):

- `rows` — câte rânduri are turnul

**Exemplu**

Dacă utilizatorul tastează

```text
5
```

programul ar trebui să afișeze

```text
*
**
***
****
*****
```
