Verifică dacă un număr întreg este un **palindrom**: un număr care se citește la fel de la stânga la dreapta și de la dreapta la stânga.

Numerele negative nu sunt niciodată palindroame (din cauza semnului minus). Numerele dintr-o singură cifră sunt întotdeauna palindroame.

### Date de intrare

- Linia 1: un singur număr întreg (orice valoare de tip `int`, de la -2^31 la 2^31 - 1)

### Rezultat

- `true` dacă numărul este un palindrom, `false` în caz contrar.

### Exemple

```
Intrare:
121

Ieșire:
true
```

```
Intrare:
-121

Ieșire:
false
```

```
Intrare:
10

Ieșire:
false
```

```
Intrare:
0

Ieșire:
true
```

Un număr dintr-o singură cifră, inclusiv 0, se citește mereu la fel în ambele sensuri.

```
Intrare:
12321

Ieșire:
true
```
