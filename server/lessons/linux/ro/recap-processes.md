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

## Misiune: Inspecție de sănătate a sistemului

Stația se apropie de un câmp de resturi și căpitanul vrea o verificare completă
a sistemelor înregistrată înainte de intrare. Parcurge secvența standard de
diagnoză.

1. Rulează `ps aux` pentru a inspecta toate procesele active — confirmă că
   monitorul reactorului și suportul vital rulează.
2. Rulează `df -h` pentru a verifica spațiul disponibil pe toate sistemele de
   fișiere.
3. Rulează `du -sh logs/` pentru a măsura cât de mult a crescut directorul de
   loguri.
4. Rulează `date` pentru a marca temporal această inspecție.
5. Rulează `history` pentru a confirma că fiecare comandă de diagnoză este
   înregistrată în jurnalul de audit.

**Rezultat așteptat**

Ar trebui să vezi procesele `reactor-monitor` și `life-support` active,
statisticile de utilizare a discului pentru toate punctele de montare,
dimensiunea lui `logs/`, data curentă și istoricul complet al comenzilor tale.
