Uneori un proces se comportă urât — îngheață, consumă tot CPU-ul sau pur și
simplu trebuie oprit. Comanda `kill` trimite un **semnal** către un proces,
cerându-i (sau forțându-l) să se termine.

Forma de bază este: `kill PID`.

```bash
kill 510
```

Aceasta trimite semnalul **15 (SIGTERM)** — un politicos „te rog să te oprești”.
Majoritatea programelor bine educate își fac curățenie și ies.

### Forțarea unui proces încăpățânat

Dacă un proces ignoră SIGTERM, trimite semnalul **9 (SIGKILL)** — o terminare
imediată și necondiționată:

```bash
kill -9 510
```

Procesul nu mai are șansa să curețe nimic; kernelul îl distruge instantaneu.
Folosește `-9` doar când semnalul politicos eșuează.

### Joburi în fundal cu &

Poți porni un proces în fundal adăugând `&` la sfârșit:

```bash
sleep 300 &
```

```text
[1] 1312
```

Shell-ul îți dă PID-ul (`1312`) ca să-l poți opri ulterior cu `kill`, dacă e
nevoie.

---

## Misiune: Termină computerul de navigație blocat

Computerul de navigație (PID **510**) s-a blocat la jumătatea unui calcul și nu
mai răspunde. Pilotul nu poate trasa o rută până când nu este repornit.

1. Folosește `kill -9 510` pentru a termina forțat procesul blocat.
2. Rulează `ps aux` pentru a confirma că nu mai rulează.

**Rezultat așteptat**

Output-ul `ps aux` nu mai listează procesul `nav-computer`.
