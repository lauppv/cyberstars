Bun venit la a doua parte a curriculumului de Python. Până acum, am învățat **uneltele**: variabile, bucle, funcții, liste, dicționare. Acum învățăm cum să **gândim** cu ele

Cea mai importantă abilitate în programare nu este să cunoști sintaxa. Este să știi cum să **împarți o problemă în pași mai mici**. Asta se numește **descompunere**

---

Să zicem că cineva îți cere: „Scrie un program care găsește cel mai frecvent cuvânt dintr-o propoziție"

Dacă încerci să scrii totul dintr-o dată, te vei pierde. În schimb, gândește-te pas cu pas

**Pasul 1**: Cum obțin cuvintele individuale dintr-o propoziție? → folosește **.split()**

```py
propozitie = "the cat sat on the mat the cat"
cuvinte = propozitie.split(" ")
print(cuvinte)
```

Rezultat **['the', 'cat', 'sat', 'on', 'the', 'mat', 'the', 'cat']**

**Pasul 2**: Cum număr de câte ori apare fiecare cuvânt? → folosește un dicționar

```py
contor = {}
for cuvant in cuvinte:
    if cuvant in contor:
        contor[cuvant] = contor[cuvant] + 1
    else:
        contor[cuvant] = 1
print(contor)
```

Rezultat **{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}**

**Pasul 3**: Cum găsesc care cuvânt are numărul cel mai mare? → parcurge dicționarul

```py
cel_mai_bun_cuvant = ""
cel_mai_bun_numar = 0
for cuvant, contor in contor.elemente():
    if contor > cel_mai_bun_numar:
        cel_mai_bun_numar = contor
        cel_mai_bun_cuvant = cuvant
print(f"Cel mai frecvent: {cel_mai_bun_cuvant} ({cel_mai_bun_numar} ori)")
```

Rezultat **Cel mai frecvent: the (3 ori)**

---

Fiecare pas este simplu în sine. Trucul este să **nu încerci să rezolvi totul dintr-o dată**. În schimb:

1. **Înțelege** ce cere problema
2. **Împarte-o** în sub-probleme mai mici
3. **Rezolvă** fiecare sub-problemă pe rând
4. **Combină** soluțiile

Așa gândesc programatorii profesioniști. Nimeni nu scrie un program dintr-o singură mișcare. Îl construiesc bucată cu bucată, testând fiecare bucată pe parcurs

---

Hai să mai facem una. „Dată fiind o listă de numere, găsește toate perechile care însumează o țintă"

**Pasul 1**: Ce înseamnă „toate perechile"? → fiecare combinație de două numere

```py
numere = [1, 3, 5, 7, 2]
tinta = 8
```

**Pasul 2**: Cum verific fiecare pereche? → buclă imbricată

```py
for i in range(len(numere)):
    for j in range(i + 1, len(numere)):
        if numere[i] + numere[j] == tinta:
            print(f"{numere[i]} + {numere[j]} = {tinta}")
```

Rezultat

```text
1 + 7 = 8
3 + 5 = 8
```

De ce **range(i + 1, len(numere))**? Pentru că nu vrem să formăm o pereche dintr-un număr cu el însuși, și nu vrem să numărăm aceeași pereche de două ori (3+5 și 5+3 sunt aceeași pereche)

---

## Misiune: Analizatorul de Jurnal

Jurnalul stației este un singur șir de coduri de eveniment separate prin spații (deja în dreapta). **Împarte munca în trei funcții**, apoi folosește-le împreună:

1. `desparte_coduri(jurnal)` — returnează **lista** de coduri (folosește `.split(" ")`)
2. `numara_coduri(coduri)` — returnează un **dicționar** care asociază fiecărui cod de câte ori apare
3. `cel_mai_frecvent(numere)` — returnează codul cu numărul **cel mai mare**

În programul principal, apelează funcțiile în ordine, apoi afișează:

- `Coduri: ` apoi numărul total de coduri
- fiecare cod ca `cod: contor` (parcurge dicționarul)
- `Cel mai frecvent: ` apoi codul cel mai frecvent

**Rezultat**

```text
Coduri: 6
alpha: 3
beta: 2
gamma: 1
Cel mai frecvent: alpha
```
