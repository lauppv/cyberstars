În loc de litere, poți seta permisiunile cu un **număr octal de trei cifre**. Fiecare
cifră reprezintă un grup (user, group, others) și este **suma** dintre:

| Permisiune    | Valoare |
| ------------- | ------- |
| Citire (r)    | 4       |
| Scriere (w)   | 2       |
| Execuție (x)  | 1       |
| Niciuna       | 0       |

### Numere uzuale de permisiuni

| Număr  | Semnificație                            | Șir          |
| ------ | --------------------------------------- | ------------ |
| `755`  | owner: rwx, group: r-x, others: r-x     | `-rwxr-xr-x` |
| `644`  | owner: rw-, group: r--, others: r--     | `-rw-r--r--` |
| `700`  | owner: rwx, group: ---, others: ---     | `-rwx------` |
| `600`  | owner: rw-, group: ---, others: ---     | `-rw-------` |

### Folosirea lui chmod cu numere

```bash
chmod 755 script.sh
chmod 644 readme.txt
```

Forma numerică setează **toate** permisiunile deodată — nu există „adaugă" sau „elimină", înlocuiești întregul set.

### Când folosești fiecare formă?

- **Simbolic** (`u+x`) — când vrei să schimbi un singur lucru fără să afectezi restul.
- **Numeric** (`755`) — când știi exact care trebuie să fie permisiunile finale.

---

## Misiune: Securizează scriptul propulsorului

Scriptul `engine_control.sh` aprinde propulsorul principal — doar personalul autorizat ar trebui să aibă acces la el. Politica de securitate a stației cere permisiunea `750` (proprietar: acces complet, grup: citire și execuție, ceilalți: nimic).

1. Folosește `chmod 750` pentru a seta permisiunile corecte pe `engine_control.sh`.
2. Rulează `ls -l engine_control.sh` pentru a verifica schimbarea.

**Rezultat așteptat**

`ls -l` arată `-rwxr-x---` pentru `engine_control.sh`.
