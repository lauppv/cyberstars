Capitolul 5 ți-a dat instalațiile sanitare ale stației. Iată trusa ta de unelte:

| Simbol | Scop                                           |
| ------ | ---------------------------------------------- |
| `>`    | Redirecționează ieșirea în fișier (suprascrie) |
| `>>`   | Redirecționează ieșirea în fișier (adaugă)     |
| `<`    | Trimite un fișier ca intrare                   |
| `\|`   | Pasează ieșirea către comanda următoare        |
| `2>`   | Redirecționează doar erorile                   |
| `2>&1` | Unește erorile cu stdout                       |

Pipe-urile și redirecționarea îți permit să construiești **pipeline-uri de date** — iei
date brute, le filtrezi, le transformi și salvezi rezultatul, totul într-o singură linie.

Regula de aur: **fiecare comandă face o singură treabă**. Pipe-urile leagă treburile
într-un flux de lucru.

---

## Misiune: Raportul de telemetrie

Puntea de inginerie tocmai a aruncat telemetrie brută în `telemetry.raw`. Inginerul-șef are nevoie de o listă curată și sortată a tuturor avertismentelor, depusă la dosar înainte de următoarea revizie de sisteme.

1. Construiește un pipeline care găsește toate liniile care conțin `WARN` în `telemetry.raw`, le sortează alfabetic și salvează rezultatul în `warnings_sorted.txt` folosind `>`.
2. Adaugă linia `-- end of report --` la `warnings_sorted.txt` folosind `>>`.

În total, două comenzi.

**Rezultat așteptat**

Rulând `cat warnings_sorted.txt`, vei vedea trei linii `WARN` sortate, urmate de `-- end of report --`.
