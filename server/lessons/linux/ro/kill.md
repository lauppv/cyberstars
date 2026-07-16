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
mai răspunde. Pilotul îl vrea oprit și un raport de incident depus la dosar.

1. Termină forțat computerul de navigație blocat (PID **510**).
2. Salvează o instantanee proaspătă a tuturor proceselor încă active într-un fișier
   numit `dupa-oprire.txt`.
3. Creează un folder numit `jurnal-incident` și mută `dupa-oprire.txt` în el.
4. Numără de câte ori mai apare `nav-computer` în instantaneea salvată.

**Rezultat așteptat**

`jurnal-incident/dupa-oprire.txt` nu mai listează procesul `nav-computer`
(numărul este `0`).
