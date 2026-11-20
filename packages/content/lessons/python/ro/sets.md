Cunoaștem listele, tuplurile și dicționarele. E timpul pentru ultimul tip mare de colecție: mulțimile (sets)

O **mulțime** (set) este o colecție în care **fiecare element este unic**. Nu sunt permise duplicate. Gândește-te la asta ca la lista de invitați la o petrecere: fiecare persoană poate fi pe listă o singură dată

```py
oaspeti = {"Tommy", "Lance", "Cortez", "Tommy"}
print(oaspeti)
```

Ieșire

```text
{'Lance', 'Cortez', 'Tommy'}
```

Stai, am scris Tommy de două ori, dar el apare o singură dată. Asta este toată ideea unei mulțimi: elimină automat duplicatele. Observă de asemenea că ordinea ar putea fi diferită de cum le-am scris noi. Mulțimile nu țin cont de ordine, doar de ce conțin

---

Mulțimile folosesc **acolade {}**, exact ca dicționarele. Dar nu există cheie: valoare, doar valori. Dacă are două puncte este un dicționar, dacă nu are este o mulțime

```py
setul_meu = {1, 2, 3}
dictul_meu = {"a": 1, "b": 2}
```

Ai grijă cu colecțiile goale

```py
dict_gol = {}
set_gol = set()
```

Un **{}** gol creează un dicționar, nu o mulțime. Ca să creezi o mulțime goală, folosește **set()**

---

Putem adăuga elemente cu **.add()** și elimina cu **.remove()**

```py
arme = {"bata", "pistol"}
arme.add("pusca")
print(arme)

arme.remove("bata")
print(arme)
```

Observă că folosim .add(), nu .append() ca la liste. Mulțimile nu au o ordine, așa că „adăugarea la final" nu are sens

---

Operatorul **in** verifică dacă o valoare se află într-o colecție. Funcționează și cu liste și dicționare. Mulțimile sunt utile mai ales când vrem valori unice sau trebuie să comparăm grupuri de valori

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

Mulțimile pot face și **operații între mulțimi**: combină grupuri, găsesc elementele comune sau pe cele care apar doar într-un grup

```py
echipaj = {"Tommy", "Lance", "Cortez"}
ingineri = {"Lance", "Phil"}

print(echipaj | ingineri)  # reuniune: toți din oricare mulțime
print(echipaj & ingineri)  # intersecție: în ambele mulțimi
print(echipaj - ingineri)  # diferență: în echipaj, dar nu în ingineri
print(echipaj ^ ingineri)  # diferență simetrică: doar într-o mulțime
```

Poți folosi și metodele `.union()`, `.intersection()`, `.difference()` și `.symmetric_difference()`

---

len() funcționează și pe mulțimi

```py
culori = {"rosu", "verde", "albastru", "rosu"}
print(len(culori))
```

Rezultatul **3**, nu 4, pentru că duplicatul rosu a fost eliminat

---

## Misiune: Triajul Semnalelor

Două antene ale stației au raportat codurile de semnal detectate. Listele sunt în `echipa_a` și `echipa_b`. Transformă fiecare listă într-o mulțime, apoi:

1. Afișează `Comune: ` și numărul codurilor detectate de ambele antene
2. Cere operatorului un cod folosind `input("Cod semnal: ")`
3. Dacă ambele antene l-au detectat, afișează `Confirmat de ambele`
4. Altfel, dacă una dintre antene l-a detectat, afișează `Detectat de una`
5. Dacă niciuna dintre antene nu l-a detectat, afișează `Nedetectat`

Folosește intersecția (`&`) pentru a găsi codurile detectate de ambele antene. Folosește `if`, `elif` și `else` pentru a alege mesajul potrivit.

**Ieșire**

```text
Comune: 1
Cod semnal: B2
Confirmat de ambele
```
