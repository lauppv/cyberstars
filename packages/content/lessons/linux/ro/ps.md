Orice program care rulează pe un sistem Linux se numește **proces**. Fiecare proces
are un număr unic: **PID**-ul său (Process ID). Comanda `ps` îți arată o
instantanee a proceselor care rulează chiar acum.

Singură, `ps` afișează doar procesele legate de sesiunea ta curentă de terminal:

```bash
ps
```

```text
  PID TTY          TIME CMD
 1201 pts/0    00:00:00 bash
 1245 pts/0    00:00:00 ps
```

De obicei vezi doar shell-ul tău și `ps`. Pentru a vedea toate procesele din
sistem, folosește `ps aux`:

```bash
ps aux
```

```text
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  16956  1024 ?        Ss   08:00   0:01 /sbin/init
student   1201  0.0  0.2  22340  2048 pts/0    S    09:12   0:00 bash
student   1245  0.0  0.1  18432   896 pts/0    R+   09:15   0:00 ps aux
```

Coloanele îți spun: cine deține procesul, PID-ul său, consumul de resurse și
comanda care l-a pornit. Când stația merge greoi, `ps aux` este prima ta unealtă
de diagnoză.

---

## Misiune: Verificarea Stării Reactorului

Ingineria tocmai a transmis prin radio: are nevoie de o dovadă scrisă că programul care monitorizează reactorul încă rulează, altfel puntea nu mai primește citirile de temperatură. Salvează linia reactorului din lista completă de procese ale stației, și doar pe a reactorului, ca `verificare-stare/stare-reactor.txt`, direct din listă, nu scrisă de mână.

**Rezultat așteptat**

`verificare-stare/stare-reactor.txt` ține linia monitorului reactorului din lista de procese, cu utilizatorul, id-ul procesului și comanda lui completă.
