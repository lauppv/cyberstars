# Inversează un șir

Având o singură linie de text, afișeaz-o **inversată**.

### Date de intrare

O singură linie care conține un șir `s`.

### Rezultat

Șirul `s` scris de la coadă la cap, pe o singură linie.

### Exemple

```
Intrare:  hello
Ieșire: olleh
```

```
Intrare:  CyberStars
Ieșire: sratSrebyC
```

```
Intrare:  a
Ieșire: a
```

Un singur caracter inversat este el însuși.

```
Intrare:  noon
Ieșire: noon
```

Unele șiruri arată la fel inversate — e o coincidență a literelor lor, nu un
caz special pe care codul tău trebuie să-l detecteze.

### Indicii

- Șirurile suportă felierea (slicing) — `s[::-1]` inversează un șir într-un singur pas.
- Poți de asemenea construi șirul inversat cu o buclă `for` care merge înapoi.
- Nu uita să faci `print()` rezultatului!
