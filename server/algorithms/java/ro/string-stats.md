# Ușor · Statistici despre șir

Creează o clasă **AnalizatorText** care primește un șir în constructorul său și oferă trei metode:

- `numarVocale()` — returnează numărul de vocale (a, e, i, o, u — fără sensibilitate la majuscule)
- `numarConsoane()` — returnează numărul de consoane (litere care nu sunt vocale)
- `numarCuvinte()` — returnează numărul de cuvinte (separate prin spații)

Citește o singură linie de text de la stdin. Creează un `AnalizatorText` și afișează cele trei statistici.

### Date de intrare

- Linia 1: un șir de text (doar litere și spații)

### Rezultat

- Linia 1: `Vocale: X`
- Linia 2: `Consoane: X`
- Linia 3: `Cuvinte: X`

### Exemple

```
Intrare:
Salut lume

Ieșire:
Vocale: 4
Consoane: 5
Cuvinte: 2
```

```
Intrare:
Java e fain

Ieșire:
Vocale: 5
Consoane: 4
Cuvinte: 3
```

```
Intrare:
Cer

Ieșire:
Vocale: 1
Consoane: 2
Cuvinte: 1
```

`y` nu este numărat aici ca vocală — contează doar a, e, i, o, u.
