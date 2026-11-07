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

Forma numerică setează **toate** permisiunile deodată: nu există „adaugă" sau „elimină", înlocuiești întregul set.

### Când folosești fiecare formă?

- **Simbolic** (`u+x`): când vrei să schimbi un singur lucru fără să afectezi restul.
- **Numeric** (`755`): când știi exact care trebuie să fie permisiunile finale.

---

## Misiune: Securizează Scriptul Propulsorului

`control_motor.sh` pornește propulsorul principal și vine cu `citeste-ma.txt`. Securitatea stației stabilește accesul fiecărui fișier dintr-un singur pas, pentru toate cele trei grupuri deodată:

- `control_motor.sh`: proprietarul poate face orice, grupul îl poate citi și rula, ceilalți nimic.
- `citeste-ma.txt`: proprietarul îl poate citi și modifica, grupul doar citi, ceilalți nimic.

Apoi mută-le pe amândouă într-un folder nou `sala-motoare`.

**Rezultat așteptat**

Ambele fișiere stau în `sala-motoare` exact cu accesul de mai sus.
