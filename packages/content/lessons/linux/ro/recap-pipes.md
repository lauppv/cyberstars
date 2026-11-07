Capitolul 5 a fost despre unde ajunge ce afișează o comandă: într-un fișier, la sfârșitul unuia, departe de ecran sau direct în comanda următoare.

Cu ele poți construi un raport întreg din date brute fără să scrii tu vreo linie din el. Fiecare comandă face un singur lucru; să le legi e partea ta.

---

## Misiune: Raportul de Telemetrie

Puntea de inginerie a descărcat telemetria brută în `telemetrie.raw`: linii `OK`, `WARN` și `ERR`, toate amestecate. Inginerul-șef vrea `raport.txt`, așezat exact așa:

```text
RAPORT TELEMETRIE
(fiecare linie WARN, în ordine alfabetică)
(fiecare linie ERR, în ordine alfabetică)
-- sfarsit de raport --
```

Titlul și linia de final le scrii tu; toate celelalte linii vin direct din telemetrie, niciodată scrise de mână.

**Rezultat așteptat**

`raport.txt` începe cu titlul, listează avertismentele și apoi erorile, fiecare grup sortat, și se termină cu linia de final.
