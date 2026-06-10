# Sum of Digits

Având un număr întreg, afișează **suma cifrelor sale**.

### Date de intrare

O singură linie care conține un număr întreg `n` (poate fi negativ).

### Rezultat

Suma cifrelor lui `n`. Dacă `n` este negativ, ignoră semnul minus.

### Exemple

```
Intrare:  1234
Ieșire: 10
```

```
Intrare:  -56
Ieșire: 11
```

### Indicii

- Convertește numărul într-un șir, apoi parcurge fiecare caracter.
- Folosește `abs()` pentru a trata numerele negative, sau pur și simplu sari peste caracterele care nu sunt cifre.
- `int(ch)` convertește un caracter cifră înapoi într-un număr.
- Poți de asemenea rezolva asta cu `%` și `//` într-o buclă `while` — încearcă ambele abordări!
