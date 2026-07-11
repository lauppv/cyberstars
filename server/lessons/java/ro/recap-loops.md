Combină **buclele for și while**, **break / continue** și **condiții**

---

## Misiune: Tura de Colectare

Tommy face turul de colectare prin Vice City. Magazinele de pe stradă sunt numerotate de la **1** până la un total, iar el le vizitează pe rând, în ordine crescătoare. Fiecare magazin plătește o sumă egală cu numărul lui (magazinul 1 plătește 1, magazinul 2 plătește 2, și tot așa).

Două lucruri îi pot strica tura:

- un magazin este **închis** azi — sare peste el cu **continue** (nu colectează nimic acolo) și merge mai departe
- la un magazin îl **așteaptă poliția** — oprește toată tura imediat cu **break** și nu colectează de la acel magazin

Stochează numărul total de magazine în `totalMagazine`, magazinul închis în `magazinInchis` și magazinul unde așteaptă poliția în `magazinPolitie`. Apoi folosește o buclă care parcurge magazinele de la **1** la total. Pentru fiecare magazin de la care chiar colectează, afișează `Magazin N` (unde **N** e numărul magazinului) și adună suma într-un total. La final, afișează `Total: X`.

**Exemplu** pentru **6** magazine, cu magazinul închis **3** și poliția la magazinul **5**:

```text
Magazin 1
Magazin 2
Magazin 4
Total: 7
```

(Magazinul 3 e sărit, iar la magazinul 5 se oprește, deci 6 nu mai e atins. Totalul e 1 + 2 + 4 = 7.)

**Exemplu** pentru **4** magazine, cu închis **10** și poliția la **10** (niciunul nu apare, tura merge până la capăt):

```text
Magazin 1
Magazin 2
Magazin 3
Magazin 4
Total: 10
```

**Exemplu** pentru **6** magazine, cu închis **2** și poliția la magazinul **1** (se oprește din prima, nu colectează nimic):

```text
Total: 0
```
