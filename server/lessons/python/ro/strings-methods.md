Un **string** este mai mult decât o simplă bucată de text pe care o afișăm. **Python** ne oferă multe unelte ca să inspectăm și să modificăm string-uri, iar noi o să ne uităm la cele mai utile

---

Cât de lung este un nume? Câte litere are? **len()** ne spune

```py
nume = "Tommy Vercetti"
print(len(nume))
```

Rezultatul **14**. Da, **spațiul** contează și el. Fiecare caracter contează, inclusiv spațiile, virgulele, punctele, semnele de exclamare. Încearcă cu **len("Lance Vance Dance")** :)

---

Putem transforma un string în **majuscule** sau **minuscule**

```py
nume = "tommy vercetti"
print(nume.majuscule())   # TOMMY VERCETTI
print(nume.lower())   # tommy vercetti
```

Observă **punctul** dintre **nume** și **upper()**. **Sintaxa cu punct** înseamnă: „ia acest string și aplică-i această metodă". O **metodă** este pur și simplu o funcție care aparține a ceva, în cazul acesta unui string

**Important**: **nume.upper()** **NU schimbă** variabila originală. Returnează un string **nou**

```py
nume = "tommy vercetti"
nume.majuscule()
print(nume)
```

Va afișa **tommy vercetti**, cu litere mici ca înainte, pentru că nu am făcut **nimic** cu rezultatul lui **nume.upper()**. Ca să-l păstrăm cu adevărat cu majuscule

```py
nume = "tommy vercetti"
nume = nume.majuscule()
print(nume)
```

Acum **nume** stochează noua valoare. Acest tip de capcană prinde absolut pe toată lumea la început, așa că nu-ți face griji dacă te încurcă :)

---

Putem **lipi string-uri împreună** cu **+**. Acest lucru se numește **concatenare**

```py
prenume = "Tommy"
nume_familie = "Vercetti"
nume_complet = prenume + " " + nume_familie
print(nume_complet)
```

Rezultatul **Tommy Vercetti**. Observă că am adăugat **" "** la mijloc, altfel am obține **TommyVercetti** lipite. String-urile nu adaugă spații în locul nostru, trebuie să o facem noi

Apropo, ai văzut deja o metodă mult mai frumoasă de a combina string-uri cu **f-string-urile** dintr-o lecție anterioară. Ambele funcționează, dar **f-string-urile** sunt de obicei mai ușor de citit

---

Cel mai puternic truc: **slicing-ul**. Putem lua o bucată dintr-un string indicând poziția lui de **început** și **sfârșit**

```py
nume = "Tommy Vercetti"
print(nume[0])      # T
print(nume[1])      # o
print(nume[0:5])    # Tommy
print(nume[6:14])   # Vercetti
```

**Important**: în programare, numărarea începe de la **0**, **NU** de la **1**. Deci **nume[0]** este **prima** literă, **nume[1]** este a doua, și așa mai departe

**nume[0:5]** înseamnă „de la poziția **0**, până la dar **FĂRĂ** să includă poziția **5**". Deci luăm pozițiile **0, 1, 2, 3, 4**, care formează **Tommy**. La fel ca la **range()** în bucla **for**, sfârșitul este exclusiv

Putem de asemenea să omitem unul dintre numere

```py
nume = "Tommy Vercetti"
print(nume[:5])    # Tommy   (de la început până la 5)
print(nume[6:])    # Vercetti (de la 6 până la sfârșit)
```

---

## Misiune: Ecusonul Echipajului

Stația tipărește un ecuson de identificare din numele complet al unui membru al echipajului. Scrie un program care **citește un nume complet** și afișează ecusonul folosind uneltele pentru string-uri pe care tocmai le-ai învățat.

**Input** (tastat de utilizator când programul rulează):

- numele complet al membrului echipajului (de exemplu `Tommy Vercetti`)

**Rezultat**

Patru linii:

- `Nume: ` apoi numele complet cu MAJUSCULE
- `Litere: ` apoi câte caractere are numele (spațiul contează și el)
- `Inițială: ` apoi prima literă, cu majusculă
- `Etichetă: ` apoi primele trei caractere, cu litere mici

**Exemplu**

Dacă utilizatorul tastează

```text
Tommy Vercetti
```

programul ar trebui să afișeze

```text
Nume: TOMMY VERCETTI
Litere: 14
Inițială: T
Etichetă: tom
```
