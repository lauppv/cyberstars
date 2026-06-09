Capitolul 7 te-a învățat stratul de securitate al sistemului de fișiere al stației:

| Comandă     | Scop                                       |
| ----------- | ------------------------------------------ |
| `ls -l`     | Vezi permisiunile și proprietarul          |
| `chmod u+x` | Adaugă/elimină permisiuni (simbolic)       |
| `chmod 755` | Setează toate permisiunile deodată (numeric) |
| `whoami`    | Afișează numele tău de utilizator          |
| `id`        | Afișează uid, gid și grupurile             |

Reține triada de permisiuni: **user → group → others**, fiecare cu `r`, `w`, `x`.
Numeric: r=4, w=2, x=1 — adună-le pe grup.

---

## Misiune: Protocol de izolare

A fost detectată o breșă de securitate pe puntea 3. Căpitanul a emis un ordin de izolare — trei fișiere din directorul tău trebuie să aibă permisiunile restrânse imediat.

1. `launch_codes.txt` — Strict secret. Doar proprietarul poate citi și scrie. Niciun acces pentru grup sau ceilalți. Setează la `600`.
2. `status_report.sh` — Script operațional. Proprietarul primește acces complet (rwx), grupul poate citi și executa, ceilalți nimic. Setează la `750`.
3. `public_bulletin.txt` — Buletin pentru întreaga stație. Toți pot citi, dar doar proprietarul poate scrie. Setează la `644`.

Folosește `chmod` pe fiecare fișier, apoi rulează `ls -l` pentru a verifica.

**Rezultat așteptat**

`ls -l` arată `-rw-------` pentru `launch_codes.txt`, `-rwxr-x---` pentru `status_report.sh` și `-rw-r--r--` pentru `public_bulletin.txt`. Izolare completă.
