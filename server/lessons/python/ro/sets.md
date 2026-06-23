Cunoaștem **listele**, **tuplurile** și **dicționarele**. E timpul pentru ultimul tip mare de colecție: **mulțimile** (sets)

O **mulțime** (set) este o colecție în care **fiecare element este unic**. Nu sunt permise duplicate. Gândește-te la asta ca la lista de invitați la o petrecere — fiecare persoană poate fi pe listă o **singură** dată

```py
oaspeti = {"Tommy", "Lance", "Cortez", "Tommy"}
print(oaspeti)
```

Ieșire

```text
{'Lance', 'Cortez', 'Tommy'}
```

Stai, am scris **Tommy** de două ori, dar el apare o singură dată. Asta este toată ideea unei mulțimi — elimină automat duplicatele. Observă de asemenea că **ordinea ar putea fi diferită** de cum le-am scris noi. Mulțimile nu țin cont de ordine, doar de **ce conțin**

---

Mulțimile folosesc **acolade {}**, exact ca dicționarele. Dar nu există **cheie: valoare**, doar valori. Dacă are două puncte este un dicționar, dacă nu are este o mulțime

```py
setul_meu = {1, 2, 3}
dictul_meu = {"a": 1, "b": 2}
```

**Ai grijă** cu colecțiile goale

```py
dict_gol = {}
set_gol = set()
```

Un **{}** gol creează un dicționar, nu o mulțime. Ca să creezi o mulțime goală, folosește **set()**

---

Putem **adăuga** elemente cu **.add()** și **elimina** cu **.remove()**

```py
arme = {"bat", "pistol"}
arme.add("shotgun")
print(arme)

arme.remove("bat")
print(arme)
```

Observă că folosim **.add()**, nu **.append()** ca la liste. Mulțimile nu au o ordine, așa că „adăugarea la final" nu are sens

---

Cel mai util lucru la mulțimi: verificarea dacă ceva **se află în** mulțime. Acest lucru este **extrem de rapid**, mult mai rapid decât verificarea într-o listă

```py
jucatori_banati = {"Sonny", "Diaz", "Gonzalez"}

jucator = "Tommy"
if jucator in jucatori_banati:
    print(f"{jucator} este interzis!")
else:
    print(f"{jucator} este binevenit")
```

Rezultatul **Tommy este binevenit**

---

Un caz de utilizare foarte des întâlnit: **eliminarea duplicatelor dintr-o listă**

```py
nume = ["Tommy", "Lance", "Tommy", "Cortez", "Lance", "Lance"]
nume_unice = list(set(nume))
print(nume_unice)
```

Am convertit lista într-o mulțime (care a eliminat duplicatele), apoi înapoi într-o listă. Curat și simplu

---

**len()** funcționează și pe mulțimi

```py
culori = {"red", "green", "blue", "red"}
print(len(culori))
```

Rezultatul **3**, nu 4, pentru că duplicatul **red** a fost eliminat

---

## Misiune: Jurnalul de Semnale

Stația a recepționat o listă de coduri de semnal, iar multe se repetă (deja sunt în dreapta). Fă următoarele:

1. Afișează `Total: ` apoi numărul total de semnale (lungimea listei)
2. Creează o **mulțime** cu codurile unice
3. Afișează `Unice: ` apoi câte coduri unice există
4. Verifică dacă a fost recepționat codul `D4` — afișează `D4 detectat` dacă **se află în** mulțime, altfel `D4 lipsește`

**Ieșire**

```text
Total: 8
Unice: 4
D4 detectat
```
