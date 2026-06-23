Până acum am scris multe bucle care creează o listă nouă pornind de la una existentă. Ceva de genul: „parcurge o listă, fă ceva cu fiecare element și pune rezultatul într-o listă nouă"

```py
numere = [1, 2, 3, 4, 5]
dublat = []

for n in numere:
    dublat.append(n * 2)

print(dublat)
```

Rezultat **[2, 4, 6, 8, 10]**

Acest tipar este atât de des întâlnit încât Python ne oferă o scurtătură: **list comprehension**

```py
numere = [1, 2, 3, 4, 5]
dublat = [n * 2 for n in numere]
print(dublat)
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
pare = [n for n in numere if n % 2 == 0]
print(pare)
```

Rezultat **[2, 4, 6, 8, 10]**. Doar numerele unde **n % 2 == 0** au ajuns în lista nouă

```py
nume = ["Tommy Vercetti", "Lance", "Cortez", "Phil Cassidy"]
nume_lungi = [n for n in nume if len(n) > 6]
print(nume_lungi)
```

Rezultat **['Tommy Vercetti', 'Phil Cassidy']**. Doar numele mai lungi de 6 caractere au supraviețuit

---

Putem transforma și filtra în același timp

```py
nume = ["tommy", "lance", "cortez"]
majuscule = [n.upper() for n in nume]
print(majuscule)
```

Rezultat **['TOMMY', 'LANCE', 'CORTEZ']**

```py
preturi = [10, 25, 5, 40, 15, 30]
redus = [pret * 0.9 for pret in preturi if pret > 20]
print(redus)
```

Rezultat **[22.5, 36.0, 13.5, 27.0]**. Am luat doar prețurile peste 20, apoi am aplicat o reducere de 10%

---

**Când să o folosești?** List comprehensions sunt grozave pentru transformări simple. Dacă logica devine complicată (if-uri imbricate, mai multe linii de procesare), folosește mai degrabă o buclă **for** obișnuită. Lizibilitatea este mai importantă decât să fii „deștept"

```py
scoruri = [85, 42, 91, 67, 38, 74, 95]
promovate = [s for s in scoruri if s >= 50]
print(promovate)
```

Curat. Ușor de citit. Cazul perfect de folosire

---

## Misiune: Filtru de Date

Ai o listă de citiri de senzori (deja în dreapta). Folosind **list comprehension** pentru fiecare pas:

1. Creează `high` — doar citirile **peste 80**
2. Creează `doubled` — fiecare citire **înmulțită cu 2**
3. Creează `passing` — doar citirile care sunt **50 sau mai mult**
4. Afișează toate cele trei liste, fiecare pe linia ei

**Ieșire**

```text
[95, 88, 92]
[150, 60, 190, 176, 84, 184]
[75, 95, 88, 92]
```
