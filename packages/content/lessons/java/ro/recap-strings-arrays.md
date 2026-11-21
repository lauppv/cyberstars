Pune StringBuilder, format, split, array-urile și ajutoarele lor să lucreze împreună într-un singur program

---

## Misiune: Parcarea

Tommy are acum o parcare cu etaje, iar paznicul de noapte îi trimite un raport cu locurile ocupate. Raportul e o singură linie: etajele sunt despărțite de `/`, iar pe fiecare etaj fiecare char e un loc, `X` când e ocupat și `.` când e liber. Stochează raportul într-un `String` numit `raport`, de exemplu `XX.X/..X./XXXX`.

Afișează:

1. Câte o linie pentru fiecare etaj: `Etajul N | <locurile etajului> | L libere`, cu etajele numărate de la 1
2. `Locuri libere: ` urmat de fiecare loc liber ca `etaj-loc`, despărțite de o virgulă și un spațiu, amândouă numărate de la 1. Dacă niciun loc nu e liber, afișează `Locuri libere: niciunul`
3. `Total libere: N`

Construiește lista locurilor libere cu un StringBuilder.

**Exemplu** pentru `raport = "XX.X/..X./XXXX"`

```text
Etajul 1 | XX.X | 1 libere
Etajul 2 | ..X. | 3 libere
Etajul 3 | XXXX | 0 libere
Locuri libere: 1-3, 2-1, 2-2, 2-4
Total libere: 4
```

**Exemplu** pentru `raport = "XX/X"`

```text
Etajul 1 | XX | 0 libere
Etajul 2 | X | 0 libere
Locuri libere: niciunul
Total libere: 0
```

**Exemplu** pentru `raport = "."`

```text
Etajul 1 | . | 1 libere
Locuri libere: 1-1
Total libere: 1
```
