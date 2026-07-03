# Ușor · Statistici despre șir

Creează o clasă **StringAnalyzer** care primește un șir în constructorul său și oferă trei metode:

- `vowelCount()` — returnează numărul de vocale (a, e, i, o, u — fără sensibilitate la majuscule)
- `consonantCount()` — returnează numărul de consoane (litere care nu sunt vocale)
- `wordCount()` — returnează numărul de cuvinte (separate prin spații)

Citește o singură linie de text de la stdin. Creează un `StringAnalyzer` și afișează cele trei statistici.

### Date de intrare

- Linia 1: un șir de text (doar litere și spații)

### Rezultat

- Linia 1: `Vocale: X`
- Linia 2: `Consoane: X`
- Linia 3: `Cuvinte: X`

### Exemple

```
Intrare:
Hello World

Ieșire:
Vocale: 3
Consoane: 7
Cuvinte: 2
```

```
Intrare:
Java is fun

Ieșire:
Vocale: 4
Consoane: 5
Cuvinte: 3
```

```
Intrare:
Sky

Ieșire:
Vocale: 0
Consoane: 3
Cuvinte: 1
```

`y` nu este numărat aici ca vocală — contează doar a, e, i, o, u, deci toate
cele trei litere din "Sky" sunt consoane.
