Până acum am scris multe bucle care creează o listă nouă pornind de la una existentă. Ceva de genul: „parcurge o listă, fă ceva cu fiecare element și pune rezultatul într-o listă nouă"

```py
numere = [1, 2, 3, 4, 5]
doubled = []

for n in numere:
    doubled.append(n * 2)

print(doubled)
```

Rezultat **[2, 4, 6, 8, 10]**

Acest tipar este atât de des întâlnit încât Python ne oferă o scurtătură: **list comprehension**

```py
numere = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numere]
print(doubled)
```

Rezultat **[2, 4, 6, 8, 10]**. Același rezultat, o singură linie în loc de patru. Sintaxa este: **[expresie for variabilă in colecție]**

Hai să o descompunem:

- **n \* 2** este expresia, ceea ce vrem să facem cu fiecare element
- **for n in numere** este bucla, care parcurge fiecare element
- **Parantezele drepte []** îi spun lui Python să pună rezultatele într-o listă nouă

---

Putem adăuga și un **if** ca să filtrăm elementele

```py
numere = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [n for n in numere if n % 2 == 0]
print(evens)
```

Rezultat **[2, 4, 6, 8, 10]**. Doar numerele unde **n % 2 == 0** au ajuns în lista nouă

```py
nume = ["Tommy Vercetti", "Lance", "Cortez", "Phil Cassidy"]
numeLungi = [n for n in nume if len(n) > 6]
print(numeLungi)
```

Rezultat **['Tommy Vercetti', 'Phil Cassidy']**. Doar numele mai lungi de 6 caractere au supraviețuit

---

Putem transforma și filtra în același timp

```py
nume = ["tommy", "lance", "cortez"]
upper = [n.upper() for n in nume]
print(upper)
```

Rezultat **['TOMMY', 'LANCE', 'CORTEZ']**

```py
prices = [10, 25, 5, 40, 15, 30]
discounted = [price * 0.9 for price in prices if price > 20]
print(discounted)
```

Rezultat **[22.5, 36.0, 13.5, 27.0]**. Am luat doar prețurile peste 20, apoi am aplicat o reducere de 10%

---

**Când să o folosești?** List comprehensions sunt grozave pentru transformări simple. Dacă logica devine complicată (if-uri imbricate, mai multe linii de procesare), folosește mai degrabă o buclă **for** obișnuită. Lizibilitatea este mai importantă decât să fii „deștept"

```py
scoruri = [85, 42, 91, 67, 38, 74, 95]
passed = [s for s in scoruri if s >= 50]
print(passed)
```

Curat. Ușor de citit. Cazul perfect de folosire

---

## Misiune: Filtru de Date

Ai o listă de citiri de senzori (deja în dreapta). Folosind **list comprehension** pentru fiecare pas:

1. Creează `high` — doar citirile **peste 80**
2. Creează `doubled` — fiecare citire **înmulțită cu 2**
3. Creează `passing` — doar citirile care sunt **50 sau mai mult**
4. Afișează toate cele trei liste, fiecare pe linia ei

**Rezultat**

```text
[95, 88, 92]
[150, 60, 190, 176, 84, 184]
[75, 95, 88, 92]
```
