Capitolul 8 ți-a dat uneltele pentru a inspecta și administra însuși sistemul de
operare al stației:

| Comandă               | Scop                                                   |
| --------------------- | ------------------------------------------------------ |
| `ps aux`              | Listează toate procesele active                        |
| `ps aux --sort=-%cpu` | Sortează după consumul de CPU (cel mai mare întâi)     |
| `kill PID`            | Oprește politicos un proces                            |
| `kill -9 PID`         | Forțează oprirea unui proces încăpățânat               |
| `df -h`               | Arată spațiul pe disc pentru fiecare sistem de fișiere |
| `du -sh DIR`          | Arată dimensiunea totală a unui director               |
| `date`                | Afișează data și ora curentă                           |
| `history`             | Arată comenzile anterioare                             |

Acestea sunt trusa ta de diagnoză a sistemului. Când ceva merge prost, începi cu
`ps aux` pentru a vedea ce rulează, `df -h` pentru a verifica spațiul pe disc și
`date` pentru a marca temporal incidentul.

---

## Misiune: Inspecția Stării Sistemelor

Stația se apropie de un câmp de resturi, iar căpitanul vrea o verificare a sistemelor înregistrată înainte de intrare. Verifică cât spațiu pe disc mai are stația, apoi scrie `inspectie.txt`:

1. data și ora inspecției, pe prima linie;
2. liniile de proces ale monitorului reactorului și ale suportului vital, ca dovadă că amândouă rulează;
3. cât spațiu ocupă folderul `jurnale`, în total și ușor de citit, pe ultima linie.

Fiecare linie vine direct din sistem, nu scrisă de mână.

**Rezultat așteptat**

`inspectie.txt` începe cu ora, arată că monitorul reactorului și suportul vital rulează și se termină cu mărimea lui `jurnale`.
