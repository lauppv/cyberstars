Capitolul 3 ți-a dat trusa de unelte pentru inspectarea fișierelor. Fiecare comandă
răspunde la o întrebare diferită:

| Comandă | Răspunde la                                   |
| ------- | --------------------------------------------- |
| `cat`   | „Arată-mi întregul fișier (scurt).”           |
| `head`  | „Arată-mi _începutul_.”                       |
| `tail`  | „Arată-mi _ultimele_ evenimente.”             |
| `less`  | „Lasă-mă să _derulez_ printr-un fișier lung.” |
| `wc`    | „Cât de mare este — câte linii/cuvinte?”      |

Un flux comun când inspectezi log-uri: `wc -l` pentru a vedea dimensiunea fișierului,
`head` pentru a vedea cum începe, `tail` pentru a vedea cele mai noi intrări.

---

## Misiune: Triaj al log-urilor stației

Echipajul anterior a evacuat în grabă și a lăsat în urmă trei fișiere de log.
Centrul de comandă are nevoie de un raport de stare rapid înainte să putem reocupa
stația.

1. Folosește `cat` pentru a citi `summary.log` integral.
2. Folosește `head -n 3` pentru a vedea **primele 3 linii** din `events.log`.
3. Folosește `tail -n 3` pentru a vedea **ultimele 3 linii** din `events.log`.
4. Folosește `wc -l` pentru a număra liniile din `errors.log`.

**Rezultat așteptat**

Vezi sumarul complet, primele și ultimele trei evenimente și numărul de erori
(3 linii).
