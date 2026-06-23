Avem o listă de nume. Vrem să salutăm fiecare personaj. Am putea face

```py
nume = ["Tommy", "Lance", "Cortez"]
print(f"Salut, {nume[0]}!")
print(f"Salut, {nume[1]}!")
print(f"Salut, {nume[2]}!")
```

Încă o dată, **repetăm** cod. Dacă lista are 100 de nume? Nu vom scrie 100 de print-uri. Folosim o buclă **for**. Tehnic vorbind se poate folosi și o buclă **while**, dar un **for** este mai potrivit aici

```py
nume = ["Tommy", "Lance", "Cortez"]
for i in nume:
    print(f"Salut, {i}!")
```

Rezultat

```text
Salut, Tommy!
Salut, Lance!
Salut, Cortez!
```

Ce înseamnă asta? Îi spunem lui **Python** așa: folosim **i** pentru a parcurge lista **nume**. Prima dată, **i** va fi `Tommy`, apoi **i** va fi `Lance` și tot așa. Comportamentul e similar cu cel din `for i in range()`, doar că de data asta parcurgem o listă

---

Putem folosi și **range()** cu **len()** dacă vrem **indexul** pe lângă valoare

```py
nume = ["Tommy", "Lance", "Cortez"]
for i in range(0, len(nume)):
    print(f"Erou numărul {i + 1}: {nume[i]}")
```

Rezultat

```text
Erou numărul 1: Tommy
Erou numărul 2: Lance
Erou numărul 3: Cortez
```

De ce **i + 1**? Pentru că în cod numărăm de la **0**, dar oamenii încep de obicei de la **1** când spun „primul, al doilea, al treilea". Așa că adăugăm **1** doar pentru afișare

Ambele stiluri sunt utile. **for n in nume** este mai curat când vrem doar valoarea. **for i in range(...)** este necesar când avem nevoie și de poziție

---

Un caz de folosire clasic: **adunarea** numerelor dintr-o listă

```py
preturi = [10, 20, 30, 40]
total = 0
for i in preturi:
    total = total + i
print(total)
```

Rezultat **100**. Am început cu **total = 0**, apoi pentru fiecare preț **i** l-am adăugat la **total**. Acesta este unul dintre cele mai des întâlnite tipare din programare și îl vei scrie de multe, multe ori. Citește codul linie cu linie și asigură-te că înțelegi **de ce** funcționează

---

## Misiune: Echipajul navei

Ai în dreapta lista cu cei **20** de membri ai echipajului. Controlul de la sol a selectat trei oameni pentru o ieșire în spațiu (EVA): cei aflați la **indexurile 5, 10 și 12** din listă

Parcurge lista cu o buclă **for** și afișează fiecare membru numerotat (`1. Maria`, `2. Andrei` și tot așa — folosește indexul cu **i + 1**). Pentru membrii de la indexurile **5**, **10** și **12** adaugă la final ` -> selectat pentru EVA`

Ai grijă: numărăm de la **0**, deci indexul **5** este al **6**-lea membru afișat

**Rezultat**

```text
1. Maria
2. Andrei
3. Elena
4. Mihai
5. Ana
6. Vlad -> selectat pentru EVA
7. Ioana
8. George
9. Diana
10. Radu
11. Cristina -> selectat pentru EVA
12. Alex
13. Gabriela -> selectat pentru EVA
14. Stefan
15. Laura
16. Bogdan
17. Andreea
18. Paul
19. Roxana
20. Dan
```

Schimbă indexurile selectate sau adaugă un membru nou și rulează din nou — vezi cum se mută eticheta de EVA
