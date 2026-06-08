În programele reale, avem nevoie constant să **filtrăm** datele (să păstrăm doar ce vrem) și să le **transformăm** (să modificăm fiecare element într-un fel). Acestea sunt două dintre cele mai des întâlnite operații din programare și le-am văzut deja — acum hai să le exersăm ca pe o abilitate

---

**Filtrarea** înseamnă: parcurge o listă și păstrează doar elementele care îndeplinesc o condiție

```py
scoruri = [45, 82, 67, 91, 38, 74, 55, 96]
promovate = []
for s in scoruri:
    if s >= 50:
        promovate.append(s)
print(promovate)
```

Rezultat **[82, 67, 91, 74, 55, 96]**

Sau cu list comprehension

```py
promovate = [s for s in scoruri if s >= 50]
```

Același rezultat, cod mai scurt

---

**Transformarea** înseamnă: aplică o operație fiecărui element

```py
preturi = [10.0, 25.5, 8.0, 42.0]
cu_taxa = []
for pret in preturi:
    cu_taxa.append(round(pret * 1.19, 2))
print(cu_taxa)
```

Rezultat **[11.9, 30.35, 9.52, 49.98]**

Sau cu list comprehension

```py
cu_taxa = [round(pret * 1.19, 2) for pret in preturi]
```

---

Adevărata putere apare când le **combinăm** pe amândouă: filtrăm întâi, apoi transformăm (sau invers)

```py
jucatori = [
    {"nume": "Tommy", "scor": 95, "online": True},
    {"nume": "Lance", "scor": 42, "online": False},
    {"nume": "Cortez", "scor": 88, "online": True},
    {"nume": "Phil", "scor": 71, "online": True},
    {"nume": "Sonny", "scor": 33, "online": False}
]

nume_conectati = []
for jucator in jucatori:
    if jucator["online"]:
        nume_conectati.append(jucator["nume"])
print(nume_conectati)
```

Rezultat **['Tommy', 'Cortez', 'Phil']**

Am **filtrat** (doar jucătorii online) și am **transformat** (am extras doar numele). Cu list comprehension

```py
nume_conectati = [p["nume"] for p in jucatori if p["online"]]
```

---

Hai să facem un exemplu mai complex. Avem notele unor elevi și vrem să

1. **Filtrăm** pe oricine a picat (sub 50)
2. **Transformăm** notele rămase adăugând un bonus de 5 puncte
3. **Plafonăm** la 100 (nimeni nu poate trece de 100)

```py
note = [45, 82, 67, 91, 38, 74, 55, 96]

rezultat = []
for grade in note:
    if grade >= 50:
        amplificat = grade + 5
        if amplificat > 100:
            amplificat = 100
        rezultat.append(amplificat)

print(rezultat)
```

Rezultat **[87, 72, 96, 79, 60, 100]**

Cu comprehension și **min()** pentru plafonare

```py
rezultat = [minim(g + 5, 100) for g in note if g >= 50]
```

---

## Misiune: Filtru pentru Rețeaua de Energie

Reactoarele stației raportează citiri de putere (deja în dreapta). Inginerii vor să se concentreze pe reactoarele **stabile** și să le dea un mic impuls — dar niciun reactor nu poate depăși 100.

1. **Filtrează**: păstrează doar citirile care sunt `>= 50` (reactoarele stabile).
2. **Transformă**: adaugă un impuls de 5 puncte fiecărei citiri păstrate, **plafonat la 100** (folosește `min(reading + 5, 100)` ca să nu treacă nimic peste).
3. Afișează `Cu impuls: ` urmat de lista rezultată.
4. Afișează `Reactoare stabile: ` urmat de câte au trecut testul.
5. Afișează `Medie: ` urmat de media citirilor cu impuls, rotunjită la un număr întreg cu `round()`.

**Rezultat**

```text
Cu impuls: [87, 72, 96, 79, 60, 100, 65]
Reactoare stabile: 7
Medie: 80
```
