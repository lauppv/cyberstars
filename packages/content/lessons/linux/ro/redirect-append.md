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

Dacă fișierul nu există încă, ambii operatori `>` și `>>` îl vor crea. Diferența
contează doar atunci când fișierul are deja conținut.

Un tipar des întâlnit este să folosești `>` o dată ca să pornești de la zero, apoi `>>`
ca să acumulezi date în timp, ca un jurnal de stație care crește cu fiecare tură.

---

## Misiune: Actualizarea Jurnalului de Tură

Ofițerul de gardă care pleacă a început `misiune.log` cu secvența de lansare. Tura ta adaugă două intrări după ea, `stare: scuturi nominale` și apoi `stare: echipaj pregatit`, iar prima intrare trebuie să rămână. Apoi păstrează un backup ca `arhiva/misiune-backup.log`.

**Rezultat așteptat**

`misiune.log` ține cele trei linii de stare în ordine, iar backup-ul e identic cu el.
