Capitolul 7 te-a învățat stratul de securitate al sistemului de fișiere al stației:

| Comandă     | Scop                                         |
| ----------- | -------------------------------------------- |
| `ls -l`     | Vezi permisiunile și proprietarul            |
| `chmod u+x` | Adaugă/elimină permisiuni (simbolic)         |
| `chmod 755` | Setează toate permisiunile deodată (numeric) |
| `whoami`    | Afișează numele tău de utilizator            |
| `id`        | Afișează uid, gid și grupurile               |

Reține triada de permisiuni: **user → group → others**, fiecare cu `r`, `w`, `x`.
Numeric: r=4, w=2, x=1 — adună-le pe grup.

---

## Misiune: Protocol de izolare

A fost detectată o breșă de securitate pe puntea 3. Căpitanul a emis un ordin de izolare — trei fișiere din directorul tău trebuie să aibă permisiunile restrânse imediat.

1. `coduri_lansare.txt` — Strict secret. Doar proprietarul poate citi și scrie; grupul și ceilalți nu au niciun acces.
2. `status_raport.sh` — Script operațional. Proprietarul primește acces complet, grupul poate citi și executa, iar ceilalți nimic.
3. `public_buletin.txt` — Buletin pentru întreaga stație. Toți pot citi, dar doar proprietarul poate scrie.

Setează permisiunile fiecărui fișier în consecință, apoi confirmă rezultatul.

**Rezultat așteptat**

Cele trei fișiere ajung să fie `-rw-------` pentru `coduri_lansare.txt`, `-rwxr-x---` pentru `status_raport.sh` și `-rw-r--r--` pentru `public_buletin.txt`. Izolare completă.
