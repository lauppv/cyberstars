Redirecționarea ieșirii (`>`, `>>`) controlează unde merge rezultatul.
Redirecționarea intrării (`<`) controlează de unde vine intrarea.

Tiparul este: `COMANDĂ < FIȘIER`.

Unele comenzi citesc din **intrarea standard** (stdin): implicit, tastatura. Cu `<` le
poți alimenta dintr-un fișier:

```bash
wc -l < manifest.txt
```

```text
5
```

Aici `wc -l` numără liniile. În loc să tastezi linii la tastatură, le citește din
`manifest.txt`. Observă că numele fișierului nu apare în rezultat. Aceasta este
diferența subtilă față de `wc -l manifest.txt` (care afișează numele lângă numărătoare).

### Când este util `<`?

Multe comenzi acceptă direct numele fișierelor ca argumente, deci `<` nu este mereu
necesar. Devine valoros atunci când:

- Un program citește doar din stdin (nu acceptă nume de fișier ca argument).
- Vrei să ascunzi numele fișierului din rezultat.
- Combini `<` cu `>` într-o singură comandă: `sort < nesortat.txt > sortat.txt`.

---

## Misiune: Numărătoarea Echipajului

Suportul vital are nevoie de numărul exact de oameni ca să calibreze oxigenul. Manifestul echipajului e `echipaj.txt`, câte un nume pe linie. Salvează numărul în `suport-viata/numar-echipaj.txt`: doar numărul, fără numele fișierului lângă el, făcut de o comandă care citește manifestul ca intrare.

**Rezultat așteptat**

`suport-viata/numar-echipaj.txt` ține un singur număr și nimic altceva.
