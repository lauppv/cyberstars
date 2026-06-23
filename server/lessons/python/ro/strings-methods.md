Un **string** este mai mult decât o simplă bucată de text pe care o afișăm. **Python** ne oferă multe unelte ca să inspectăm și să modificăm string-uri, iar noi o să ne uităm la cele mai utile

---

Cât de lung este un nume? Câte litere are? **len()** ne spune

```py
nume = "Tommy Vercetti"
print(len(nume))
```

Rezultatul **14**. Da, **spațiul** contează și el. Fiecare caracter contează, inclusiv virgulele, punctele, semnele de exclamare și orice alt caracter. Încearcă cu **len("password-!@#$")**

---

Putem transforma un string în **majuscule** sau **minuscule**

```py
nume = "tommy vercetti"
print(nume.upper())   # TOMMY VERCETTI
print(nume.lower())   # tommy vercetti
```

Observă **punctul** dintre **nume** și **upper()**. **Sintaxa cu punct** înseamnă: „ia acest string și aplică-i această metodă". O **metodă** este pur și simplu o funcție care aparține a ceva, în cazul acesta unui string

**Important**: **nume.upper()** **NU schimbă** variabila originală. Returnează un string **nou**

```py
nume = "tommy vercetti"
nume.upper()
print(nume)
```

Va afișa **tommy vercetti**, cu litere mici ca înainte, pentru că nu am făcut **nimic** cu rezultatul lui **nume.upper()**. Ca să-l păstrăm cu adevărat cu majuscule

```py
nume = "tommy vercetti"
nume = nume.upper()
print(nume)
```

Acum **nume** stochează noua valoare. Acest tip de capcană prinde absolut pe toată lumea la început. Dacă citim de sus în jos, povestea e simplă: avem un nume, apoi îl transformăm în litere mari și actualizăm numele, apoi îl afișăm

---

Putem **lipi string-uri împreună** cu **+**. Acest lucru se numește **concatenare**

```py
prenume = "Tommy"
nume_familie = "Vercetti"
nume_complet = prenume + nume_familie
print(nume_complet)
```

Rezultatul **TommyVercetti**. Dacă vrem să avem un spațiu între prenume și nume de familie, trebuie să îl concatenăm și pe el

```py
prenume = "Tommy"
nume_familie = "Vercetti"
nume_complet = prenume + " " + nume_familie
print(nume_complet)
```

---

Putem lua o bucată dintr-un string indicând poziția lui de **început** și **sfârșit**

```py
nume = "Tommy Vercetti"
print(nume[0])      # T
print(nume[1])      # o
print(nume[0:5])    # Tommy
print(nume[6:14])   # Vercetti
```

**nume** este o variabilă - știm deja asta. De ce **nume[0] = T**? De ce **nume[1] = o**? De fapt, de ce **nume[ceva] = altceva**?

Să ne imaginăm variabila **nume** ca pe un șir de cutiuțe, fiecare cutiuță ținând un singur caracter. Sub fiecare cutiuță este scris **numărul poziției** ei

```strindex
Tommy Vercetti
^ 0 1
```

În programare, numărarea începe de la **0**, **NU** de la **1**. Deci **nume[0]** este **prima** literă (cutiuța de la poziția 0, evidențiată mai sus), **nume[1]** este a doua, și așa mai departe. Când scriem **nume[ceva]**, **ceva** este numărul poziției, iar Python ne dă caracterul din acea cutiuță. De exemplu, **nume[9]** înseamnă „dă-mi caracterul de pe poziția **9** din **nume**", adică caracterul **c**

**nume[0:5]** înseamnă „de la poziția **0**, până la dar **FĂRĂ** să includă poziția **5**". Deci luăm pozițiile **0, 1, 2, 3, 4**, care formează **Tommy**. La fel ca la **range()** în bucla **for**, sfârșitul este exclusiv (nu îl luăm)

Putem de asemenea să omitem unul dintre numere

```py
nume = "Tommy Vercetti"
print(nume[:5])    # Tommy   (de la inceput pana la 5 - 1)
print(nume[6:])    # Vercetti (de la 6 pana la sfarsit)
```

---

## Misiune: Decodorul de Poziții

Stația citește dintr-un cuvânt de cod doar anumite poziții. Programul citește un cuvânt într-o variabilă și afișează, pe linii separate:

- caracterul de pe poziția **0**
- caracterul de pe poziția **3**
- primele **4** caractere
- caracterele de la poziția **4** până la sfârșit

**Exemplu**

Dacă utilizatorul tastează

```text
Andromeda
```

programul ar trebui să afișeze

```text
A
r
Andr
omeda
```
