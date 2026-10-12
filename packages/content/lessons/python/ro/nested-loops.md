Știm deja ce face o buclă **for**. Dar ce se întâmplă dacă punem o **buclă în interiorul altei bucle**? Asta se numește **buclă imbricată** și este unul dintre acele lucruri care par confuze la început, dar devin a doua natură odată ce le vezi în acțiune

Să începem simplu. Vrem să afișăm toate combinațiile a două aruncări de zaruri

```py
for zar1 in range(1, 7):
    for zar2 in range(1, 7):
        print(f"{zar1} {zar2}")
```

Asta va afișa **36 de linii**: (1,1), (1,2), ..., (1,6), (2,1), (2,2), ... până la (6,6)

Cum funcționează? **Bucla exterioară** începe cu **zar1 = 1**. Apoi **bucla interioară** rulează complet de la **zar2 = 1** până la **zar2 = 6**. După ce bucla interioară se termină, bucla exterioară trece la **zar1 = 2**, iar bucla interioară rulează din nou de la zero. Și așa mai departe

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

## Afișăm pe aceeași linie cu end=""

Până acum, fiecare **print()** trecea automat la o linie nouă după ce afișa. Putem schimba asta cu **end**

```py
print("a", end="")
print("b", end="")
print("c")
```

Afișează

```text
abc
```

Normal, cele trei **print()** ar fi pus **a**, **b** și **c** pe linii separate. Cu **end=""** îi spunem lui **print** „nu trece la linie nouă, lasă cursorul aici". Ultimul **print("c")** nu are **end=""**, așa că după el chiar coborâm pe linia următoare

Asta devine puternic împreună cu buclele imbricate: putem desena o formă **rând cu rând**

```py
for rand in range(3):
    for stea in range(3):
        print("*", end="")
    print()
```

Afișează

```text
***
***
***
```

Hai să urmărim ce se întâmplă:

- bucla exterioară pornește cu **rand = 0**
- bucla interioară afișează `*` de trei ori, toate pe aceeași linie datorită **end=""** → `***`
- după bucla interioară, **print()** singur (gol) coboară pe linia următoare
- bucla exterioară continuă cu **rand = 1**, apoi **rand = 2**, și totul se repetă

Bucla interioară desenează un rând întreg, iar **print()** de la final coboară pe rândul următor

---

## Misiune: Turnul de Semnal

Construiește un turn de steluțe pentru antena stației. **Citește** de la utilizator câte rânduri are turnul, apoi afișează un triunghi: primul rând are **1** steluță, al doilea **2**, al treilea **3**, și tot așa până la ultimul rând

**Exemplu**

Dacă utilizatorul tastează

```text
5
```

programul afișează

```text
*
**
***
****
*****
```
