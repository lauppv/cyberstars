Ai învățat că `>` suprascrie un fișier. Când vrei să **adaugi** linii noi la sfârșit
fără să distrugi conținutul existent, folosește `>>` (săgeată dublă).

Tiparul este: `COMANDĂ >> FIȘIER`.

```bash
echo "Entry 1: docking complete" >> ship.log
echo "Entry 2: cargo loaded" >> ship.log
cat ship.log
```

```text
Entry 1: docking complete
Entry 2: cargo loaded
```

Ambele linii s-au păstrat. Fiecare `>>` adaugă la final.

### `>` vs `>>`

| Operator | Comportament         |
| -------- | -------------------- |
| `>`      | Creează / suprascrie |
| `>>`     | Creează / adaugă     |

Dacă fișierul nu există încă, **ambii** operatori `>` și `>>` îl vor crea. Diferența
contează doar atunci când fișierul are deja conținut.

Un tipar des întâlnit este să folosești `>` o dată ca să pornești de la zero, apoi `>>`
ca să acumulezi date în timp — ca un jurnal de stație care crește cu fiecare tură.

---

## Misiune: Actualizarea jurnalului de tură

Ofițerul de gardă ieșit din tură a notat secvența de lansare în `mission.log`. Tura ta începe acum și trebuie să adaugi două intrări noi de stare, fără să ștergi înregistrarea existentă.

1. Adaugă `status: shields nominal` la `mission.log` folosind `>>`.
2. Adaugă `status: crew ready` la `mission.log` folosind `>>`.

Când termini, `cat mission.log` ar trebui să afișeze toate cele trei linii — intrarea inițială plus cele două actualizări.

**Rezultat așteptat**

```text
status: launch sequence initiated
status: shields nominal
status: crew ready
```
