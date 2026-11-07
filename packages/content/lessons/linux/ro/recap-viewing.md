Capitolul 3 ți-a dat trusa de unelte pentru inspectarea fișierelor. Fiecare comandă
răspunde la o întrebare diferită:

| Comandă | Răspunde la                                   |
| ------- | --------------------------------------------- |
| `cat`   | „Arată-mi întregul fișier (scurt).”           |
| `head`  | „Arată-mi _începutul_.”                       |
| `tail`  | „Arată-mi _ultimele_ evenimente.”             |
| `less`  | „Lasă-mă să _derulez_ printr-un fișier lung.” |
| `wc`    | „Cât de mare este, câte linii/cuvinte?”       |

Un flux comun când inspectezi log-uri: `wc -l` pentru a vedea dimensiunea fișierului,
`head` pentru a vedea cum începe, `tail` pentru a vedea cele mai noi intrări.

---

## Misiune: Triajul Jurnalelor

Echipajul anterior a evacuat în grabă și a lăsat trei jurnale în urmă. Înainte să se mute cineva înapoi, comanda vrea răspunsuri:

- Ce spune scurtul `rezumat.log`? Citește-l tot.
- Cum a început ziua din `evenimente.log` și cum s-a terminat? Câte trei evenimente de la fiecare capăt, nimic din mijloc.
- Câte erori s-au înregistrat în `erori.log`, câte una pe linie? Numărul, nu erorile.

**Rezultat așteptat**

Poți răspunde la toate trei întrebările din ce ai văzut.
