Uneori un proces se comportă urât: îngheață, consumă tot CPU-ul sau pur și
simplu trebuie oprit. Comanda `kill` trimite un **semnal** către un proces,
cerându-i (sau forțându-l) să se termine.

Forma de bază este: `kill PID`.

```bash
kill 510
```

Aceasta trimite semnalul **15 (SIGTERM)**, un politicos „te rog să te oprești”.
Majoritatea programelor bine educate își fac curățenie și ies.

### Forțarea unui proces încăpățânat

Dacă un proces ignoră SIGTERM, trimite semnalul **9 (SIGKILL)**, o terminare
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

## Misiune: Oprește Calculatorul de Navigație Blocat

Calculatorul de navigație s-a blocat în mijlocul unui calcul și nu mai răspunde la o cerere politicoasă de oprire. Pilotul vrea să dispară, și doar el: monitorul reactorului și suportul vital rămân pornite. Găsește-i procesul și oprește-l cu forța, apoi păstrează o listă proaspătă a proceselor care încă rulează ca `jurnal-incident/dupa-oprire.txt`.

**Rezultat așteptat**

Calculatorul de navigație nu mai rulează, celelalte programe ale stației da, iar `jurnal-incident/dupa-oprire.txt` e o listă de procese fără el.
