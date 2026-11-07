Capitolul 5 ți-a dat instalațiile sanitare ale stației. Iată trusa ta de unelte:

| Simbol | Scop                                           |
| ------ | ---------------------------------------------- |
| `>`    | Redirecționează ieșirea în fișier (suprascrie) |
| `>>`   | Redirecționează ieșirea în fișier (adaugă)     |
| `<`    | Trimite un fișier ca intrare                   |
| `\|`   | Pasează ieșirea către comanda următoare        |
| `2>`   | Redirecționează doar erorile                   |
| `2>&1` | Unește erorile cu stdout                       |

Pipe-urile și redirecționarea îți permit să construiești **pipeline-uri de date**: iei
date brute, le filtrezi, le transformi și salvezi rezultatul, totul într-o singură linie.

Regula de aur: **fiecare comandă face o singură treabă**. Pipe-urile leagă treburile
într-un flux de lucru.

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
