Căutarea este unul dintre cele mai fundamentale lucruri pe care le face un calculator. „Este acest utilizator în baza de date?" „Conține această listă numărul 42?" „Unde este cuvântul 'error' în acest jurnal?"

Cel mai simplu mod de a căuta este **căutarea liniară**: parcurgem lista **element cu element**, de la început la sfârșit, și verificăm fiecare element

```py
def cautare_liniara(elemente, tinta):
    for i in range(len(elemente)):
        if elemente[i] == tinta:
            return i
    return -1

nume = ["Tommy", "Lance", "Cortez", "Phil", "Sonny"]
rezultat = cautare_liniara(nume, "Cortez")
print(rezultat)
```

Afișează **2**. Cortez este la indexul 2

Dacă ținta nu este în listă, returnăm **-1** (o convenție care înseamnă „negăsit")

```py
rezultat = cautare_liniara(nume, "Shrek")
print(rezultat)
```

Afișează **-1**. Shrek nu este în Vice City :)

---

Cum funcționează? Ne uităm la poziția **0** — este Cortez? Nu. Poziția **1** — este Cortez? Nu. Poziția **2** — este Cortez? **Da!** Returnăm **2**

Dacă parcurgem întreaga listă fără să găsim ținta, returnăm **-1**

---

Putem de asemenea să căutăm ceva pe baza unei **condiții**, nu doar o potrivire exactă

```py
scoruri = [65, 42, 88, 95, 71]

for i in range(len(scoruri)):
    if scoruri[i] > 90:
        print(f"Am gasit un scor peste 90: {scoruri[i]} la indexul {i}")
        break
```

Afișează **Am găsit un scor peste 90: 95 la indexul 3**

---

**Cât de bună este căutarea liniară?** Dacă lista are **10** elemente, s-ar putea să verificăm toate cele 10. Dacă are **1.000.000** de elemente, s-ar putea să verificăm toate cele 1.000.000. Căutarea liniară verifică elementele **unul câte unul**. Cu cât mai multe elemente, cu atât durează mai mult. În cel mai rău caz (elementul negăsit), verificăm **fiecare element în parte**

Există ceva mai rapid? Da — **căutarea binară**, pe care o vom învăța mai târziu. Dar căutarea binară funcționează doar pe liste **sortate**. Căutarea liniară funcționează pe **orice**

---

## Misiune: Localizatorul Echipajului

Lista echipajului stației este o listă de nume, fiecare la o stație numerotată (stația 0, stația 1, și așa mai departe). Controlul Misiunii vrea să caute pe cineva după nume.

Scrie o funcție **gaseste_echipaj(echipaj, tinta)** care folosește **căutarea liniară** ca să returneze **numărul stației** (indexul) unde se află `tinta` în listă. Dacă numele nu este în listă, returnează **-1**.

Apoi **citește** un nume și raportează rezultatul.

**Intrare** (tastat de utilizator când rulează programul):

- numele membrului echipajului de găsit

**Ieșire** — o linie. Dacă numele este la bord, afișează numele, apoi `este la stația`, apoi numărul stației. Dacă nu, afișează numele urmat de `nu este la bord`. Vezi exemplul de mai jos pentru formularea exactă.

**Exemplu**

Dacă utilizatorul tastează

```text
Cara
```

programul ar trebui să afișeze

```text
Cara este la statia 2
```

Dacă utilizatorul tastează

```text
Zane
```

programul ar trebui să afișeze

```text
Zane nu este la bord
```
