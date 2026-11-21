În lecția List comprehension am construit liste într-o singură linie: `[n * 2 for n in numere]`. Aceeași formă scurtă merge și pentru dicționare și mulțimi. Se schimbă doar parantezele

---

Un **dict comprehension** folosește acolade și o pereche `cheie: valoare` înainte de `for`

```py
nume = ["Ada", "Alan", "Grace"]
lungimi = {n: len(n) for n in nume}
print(lungimi)
```

Rezultat

```text
{'Ada': 3, 'Alan': 4, 'Grace': 5}
```

Pentru fiecare nume, Python face o pereche: numele e cheia, lungimea lui e valoarea. E felul scurt de a scrie o buclă cu `lungimi[n] = len(n)` înăuntru

---

Un `if` la final păstrează doar unele elemente, exact ca la un list comprehension

```py
punctaje = {"Ada": 92, "Alan": 48, "Grace": 75}
au_trecut = {n: p for n, p in punctaje.items() if p >= 50}
print(au_trecut)
```

Rezultat

```text
{'Ada': 92, 'Grace': 75}
```

Putem și să schimbăm între ele cheile și valorile, sau să construim un dicționar din două liste cu `zip()`

```py
coduri = {"MER": "Mercur", "VEN": "Venus"}
dupa_nume = {planeta: cod for cod, planeta in coduri.items()}
print(dupa_nume["Venus"])
```

Rezultat

```text
VEN
```

---

Un **set comprehension** folosește acolade cu o singură valoare înainte de `for`, fără două puncte. Fiind o mulțime, fiecare valoare e păstrată o singură dată

```py
cuvinte = ["soare", "stea", "luna", "cer"]
initiale = {c[0] for c in cuvinte}
print(sorted(initiale))
```

Rezultat

```text
['c', 'l', 's']
```

Afișăm `sorted(initiale)`, nu `initiale` însăși. O mulțime nu are ordine, iar o mulțime de string-uri poate ieși în altă ordine la fiecare rulare a programului. `sorted()` dă o listă într-o ordine fixă

---

Alege parantezele după ce îți trebuie. Paranteze pătrate `[ ]` pentru o listă, unde contează ordinea și repetările. Acolade cu `cheie: valoare` pentru un dicționar, ca să cauți lucruri după o cheie. Acolade cu o singură valoare pentru o mulțime, ca să păstrezi fiecare valoare o dată

```py
numere = [3, 1, 3, 2]
print([n * n for n in numere])
print({n: n * n for n in numere})
print(sorted({n * n for n in numere}))
```

Rezultat

```text
[9, 1, 9, 4]
{3: 9, 1: 1, 2: 4}
[1, 4, 9]
```

---

## Misiune: Indexul cuvintelor

Biblioteca stației vrea un mic index al unei propoziții: cât de lung e fiecare cuvânt și cu ce litere încep cuvintele lungi

1. Începe programul cu o variabilă **text**, un string de cuvinte cu litere mici, cu un spațiu între ele. De exemplu `text = "nava a plecat de pe luna in zori"`
2. Afișează `Lungimi: ` și un dicționar cu fiecare cuvânt drept cheie și lungimea lui drept valoare, făcut cu un dict comprehension. Un cuvânt care apare de două ori e în el o singură dată, pe locul unde apare prima oară
3. Afișează `Initiale: ` și lista sortată a primelor litere ale cuvintelor cu mai mult de 3 litere, fiecare literă o dată, făcută cu un set comprehension

**text** are între 1 și 20 de cuvinte, fiecare de 1 până la 12 litere

**Exemplu** pentru text = "nava a plecat de pe luna in zori"

```text
Lungimi: {'nava': 4, 'a': 1, 'plecat': 6, 'de': 2, 'pe': 2, 'luna': 4, 'in': 2, 'zori': 4}
Initiale: ['l', 'n', 'p', 'z']
```
