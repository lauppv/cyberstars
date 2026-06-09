Redirecționarea ieșirii (`>`, `>>`) controlează **unde merge** rezultatul.
Redirecționarea intrării (`<`) controlează **de unde vine** intrarea.

Tiparul este: `COMANDĂ < FIȘIER`.

Unele comenzi citesc din **intrarea standard** (stdin) — implicit, tastatura. Cu `<` le
poți alimenta dintr-un fișier:

```bash
wc -l < manifest.txt
```

```text
5
```

Aici `wc -l` numără liniile. În loc să tastezi linii la tastatură, le citește din
`manifest.txt`. Observă că numele fișierului **nu** apare în rezultat — aceasta este
diferența subtilă față de `wc -l manifest.txt` (care afișează numele lângă numărătoare).

### Când este util `<`?

Multe comenzi acceptă direct numele fișierelor ca argumente, deci `<` nu este mereu
necesar. Devine valoros atunci când:

- Un program citește doar din stdin (nu acceptă nume de fișier ca argument).
- Vrei să ascunzi numele fișierului din rezultat.
- Combini `<` cu `>` într-o singură comandă: `sort < unsorted.txt > sorted.txt`.

---

## Misiune: Numărătoarea echipajului

Sistemul de menținere a vieții are nevoie de un număr exact al echipajului ca să calibreze nivelurile de oxigen. Lista este stocată în `crew.txt`, câte un nume pe linie.

Folosește redirecționarea intrării pentru a număra echipajul: `wc -l < crew.txt`.

**Rezultat așteptat**

Terminalul afișează doar numărul `6`, fără niciun nume de fișier lângă el.
