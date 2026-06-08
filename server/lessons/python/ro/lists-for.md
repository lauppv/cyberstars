Avem o listă de nume. Vrem să salutăm pe fiecare dintre ele. Am putea face

```py
nume = ["Tommy", "Lance", "Cortez"]
print(f"Salut, {nume[0]}!")
print(f"Salut, {nume[1]}!")
print(f"Salut, {nume[2]}!")
```

Încă o dată, **repetăm** cod. Și încă o dată, acest lucru este **interzis** :). Dacă lista are 100 de nume? Nu vom scrie 100 de print-uri. Folosim o buclă **for**, exact cum am făcut înainte

```py
nume = ["Tommy", "Lance", "Cortez"]
for n in nume:
    print(f"Salut, {n}!")
```

Rezultat

```text
Salut, Tommy!
Salut, Lance!
Salut, Cortez!
```

Ce înseamnă asta? Îi spunem lui **Python**: „pentru **fiecare nume** din lista **nume**, fă asta". La fiecare iterație, variabila **nume** ia valoarea următorului element din listă

Cuvântul-cheie **in** este același pe care l-am văzut la **range()**. Aici, în loc să parcurgem numere, parcurgem elementele unei liste

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
prices = [10, 20, 30, 40]
total = 0
for price in prices:
    total = total + price
print(total)
```

Rezultat **100**. Am început cu **total = 0**, apoi pentru fiecare preț l-am adăugat la **total**. Acesta este unul dintre cele mai des întâlnite tipare din programare și îl vei scrie de multe, multe ori. Citește codul linie cu linie și asigură-te că înțelegi **de ce** funcționează

---

## Misiune: Citiri ale Reactorului

Reactorul trimite o listă de citiri de temperatură (deja în dreapta). Parcurge-le și raportează starea de sănătate a reactorului.

Afișează, în această ordine:

1. Fiecare citire pe linia ei
2. `Total: ` apoi suma tuturor citirilor
3. `Medie: ` apoi totalul împărțit la câte citiri sunt (folosește **len()**)
4. `Avertismente: ` apoi câte citiri sunt **peste 100** (numără-le cu o buclă **for** și un **if**)

**Rezultat**

```text
90
105
100
120
85
Total: 500
Medie: 100.0
Avertismente: 2
```

Două dintre citiri (105 și 120) sunt peste 100, deci numărul de avertismente este 2. Adaugă sau elimină citiri și rulează din nou — media și numărul de avertismente ar trebui să se modifice odată cu ele :)
