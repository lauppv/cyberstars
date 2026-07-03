Ai învățat că `>` suprascrie un fișier. Când vrei să **adaugi** linii noi la sfârșit
fără să distrugi conținutul existent, folosește `>>` (săgeată dublă).

Tiparul este: `COMANDĂ >> FIȘIER`.

```bash
echo "Intrarea 1: andocare finalizata" >> nava.log
echo "Intrarea 2: marfa incarcata" >> nava.log
cat nava.log
```

```text
Intrarea 1: andocare finalizata
Intrarea 2: marfa incarcata
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

Ofițerul de gardă ieșit din tură a notat secvența de lansare în `misiune.log`. Tura ta începe acum și trebuie să adaugi două intrări noi de stare, fără să ștergi înregistrarea existentă.

1. Adaugă `stare: scuturi nominale` la `misiune.log` folosind `>>`.
2. Adaugă `stare: echipaj pregatit` la `misiune.log` folosind `>>`.

Când termini, `cat misiune.log` ar trebui să afișeze toate cele trei linii — intrarea inițială plus cele două actualizări.

**Rezultat așteptat**

```text
stare: secventa de lansare initiata
stare: scuturi nominale
stare: echipaj pregatit
```
