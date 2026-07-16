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

1. Inspectează toate procesele active — confirmă că monitorul reactorului și
   suportul vital rulează.
2. Verifică spațiul disponibil pe toate sistemele de fișiere.
3. Măsoară cât de mult a crescut directorul `jurnale/`.
4. Marchează temporal această inspecție cu data și ora curentă.
5. Revizuiește lista completă a comenzilor înregistrate în această sesiune pentru
   a confirma jurnalul de audit.

**Rezultat așteptat**

Ar trebui să vezi procesele `reactor-monitor` și `life-support` active,
statisticile de utilizare a discului pentru toate punctele de montare,
dimensiunea lui `jurnale/`, data curentă și istoricul complet al comenzilor tale.
