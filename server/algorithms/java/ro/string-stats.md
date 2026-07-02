# Ușor · Statistici despre șir

Creează o clasă **StringAnalyzer** care primește un șir în constructorul său și oferă trei metode:

- `vowelCount()` — returnează numărul de vocale (a, e, i, o, u — fără sensibilitate la majuscule)
- `consonantCount()` — returnează numărul de consoane (litere care nu sunt vocale)
- `wordCount()` — returnează numărul de cuvinte (separate prin spații)

Citește o singură linie de text de la stdin. Creează un `StringAnalyzer` și afișează cele trei statistici.

### Date de intrare

- Linia 1: un șir de text (doar litere și spații)

### Rezultat

- Linia 1: `Vowels: X`
- Linia 2: `Consonants: X`
- Linia 3: `Words: X`

### Exemple

```
Intrare:
Hello World

Ieșire:
Vowels: 3
Consonants: 7
Words: 2
```

```
Intrare:
Java is fun

Ieșire:
Vowels: 4
Consonants: 5
Words: 3
```

```
Intrare:
Sky

Ieșire:
Vowels: 0
Consonants: 3
Words: 1
```

`y` nu este numărat aici ca vocală — contează doar a, e, i, o, u, deci toate
cele trei litere din "Sky" sunt consoane.
