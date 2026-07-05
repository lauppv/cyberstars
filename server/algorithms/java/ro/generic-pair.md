# Dificil · Pereche generică

Creează o clasă generică **Pereche<A, B>** care conține două valori de tipuri potențial diferite. Clasa trebuie să aibă metodele `getPrim()`, `getSecund()` și o metodă `interschimba()` care returnează un nou `Pereche<B, A>` cu valorile interschimbate.

Citește două valori de la stdin (un șir și un număr întreg), creează un Pereche, interschimbă-l și afișează atât perechea originală, cât și cea interschimbată.

### Date de intrare

- Linia 1: o valoare de tip șir
- Linia 2: o valoare întreagă

### Rezultat

- Linia 1: `(PRIM, SECUND)` — perechea originală
- Linia 2: `(PRIM, SECUND)` — perechea interschimbată

### Exemple

```
Intrare:
salut
42

Ieșire:
(salut, 42)
(42, salut)
```

```
Intrare:
Java
100

Ieșire:
(Java, 100)
(100, Java)
```

```
Intrare:
lume
0

Ieșire:
(lume, 0)
(0, lume)
```

```
Intrare:
x
-5

Ieșire:
(x, -5)
(-5, x)
```

Numerele întregi negative se interschimbă la fel ca orice altă valoare.
