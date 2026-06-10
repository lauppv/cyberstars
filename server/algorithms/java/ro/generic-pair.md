# Dificil · Pereche generică

Creează o clasă generică **Pair<A, B>** care conține două valori de tipuri potențial diferite. Clasa trebuie să aibă metodele `getFirst()`, `getSecond()` și o metodă `swap()` care returnează un nou `Pair<B, A>` cu valorile interschimbate.

Citește două valori de la stdin (un șir și un număr întreg), creează un Pair, interschimbă-l și afișează atât perechea originală, cât și cea interschimbată.

### Date de intrare

- Linia 1: o valoare de tip șir
- Linia 2: o valoare întreagă

### Rezultat

- Linia 1: `(FIRST, SECOND)` — perechea originală
- Linia 2: `(FIRST, SECOND)` — perechea interschimbată

### Exemple

```
Intrare:
hello
42

Ieșire:
(hello, 42)
(42, hello)
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
world
0

Ieșire:
(world, 0)
(0, world)
```

### Indicii

- Folosește generice: `class Pair<A, B>`.
- `swap()` returnează `new Pair<B, A>(second, first)`.
- Suprascrie `toString()` pentru a returna `(first, second)`.
- Când creezi perechea, folosește `Pair<String, Integer>`.
- Perechea interschimbată are tipul `Pair<Integer, String>`.
