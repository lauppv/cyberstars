# Easy · Palindrome Number

Verifică dacă un număr întreg este un **palindrom** — un număr care se citește la fel de la stânga la dreapta și de la dreapta la stânga.

Numerele negative nu sunt niciodată palindroame (din cauza semnului minus). Numerele dintr-o singură cifră sunt întotdeauna palindroame.

### Date de intrare

- Linia 1: un singur număr întreg

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

### Indicii

- Numerele negative returnează întotdeauna `false`.
- O abordare: inversează numărul cifră cu cifră și compară-l cu cel original.
- Pentru a obține ultima cifră: `num % 10`. Pentru a elimina ultima cifră: `num / 10`.
- Construiește numărul inversat înmulțind cu 10 și adăugând fiecare cifră.
- O altă abordare: convertește la un șir și verifică dacă este egal cu inversul său.
