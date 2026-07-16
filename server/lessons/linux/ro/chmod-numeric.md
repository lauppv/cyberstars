În loc de litere, poți seta permisiunile cu un **număr octal de trei cifre**. Fiecare
cifră reprezintă un grup (user, group, others) și este **suma** dintre:

| Permisiune   | Valoare |
| ------------ | ------- |
| Citire (r)   | 4       |
| Scriere (w)  | 2       |
| Execuție (x) | 1       |
| Niciuna      | 0       |

### Numere uzuale de permisiuni

| Număr | Semnificație                        | Șir          |
| ----- | ----------------------------------- | ------------ |
| `755` | owner: rwx, group: r-x, others: r-x | `-rwxr-xr-x` |
| `644` | owner: rw-, group: r--, others: r-- | `-rw-r--r--` |
| `700` | owner: rwx, group: ---, others: --- | `-rwx------` |
| `600` | owner: rw-, group: ---, others: --- | `-rw-------` |

### Folosirea lui chmod cu numere

```bash
chmod 755 script.sh
chmod 644 citeste-ma.txt
```

Forma numerică setează **toate** permisiunile deodată — nu există „adaugă" sau „elimină", înlocuiești întregul set.

### Când folosești fiecare formă?

- **Simbolic** (`u+x`) — când vrei să schimbi un singur lucru fără să afectezi restul.
- **Numeric** (`755`) — când știi exact care trebuie să fie permisiunile finale.

---

## Misiune: Securizează scriptul propulsorului

Scriptul `control_motor.sh` aprinde propulsorul principal și vine împreună cu un `citeste-ma.txt`. Politica de securitate a stației stabilește niveluri de acces stricte pentru ambele.

1. Setează permisiunile pe `control_motor.sh` astfel încât proprietarul să aibă acces complet, grupul să îl poată citi și rula, iar ceilalți să nu aibă nimic.
2. Setează permisiunile pe `citeste-ma.txt` astfel încât proprietarul să îl poată citi și modifica, iar grupul și ceilalți doar să îl poată citi.
3. Creează un folder numit `sala-motoare` și mută ambele fișiere în el.
4. Afișează listarea detaliată a folderului pentru a confirma permisiunile.

**Rezultat așteptat**

În `sala-motoare`, `control_motor.sh` este `-rwxr-x---`, iar `citeste-ma.txt` este `-rw-r--r--`.
