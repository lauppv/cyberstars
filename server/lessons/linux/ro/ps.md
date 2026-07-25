Orice program care rulează pe un sistem Linux se numește **proces**. Fiecare proces
are un număr unic — **PID**-ul său (Process ID). Comanda `ps` îți arată o
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

De obicei vezi doar shell-ul tău și `ps`. Pentru a vedea **toate** procesele din
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

## Misiune: Verificare medicală a inginerilor

Inginerii tocmai au transmis prin radio — au nevoie de o dovadă scrisă că daemonul
de monitorizare a reactorului încă rulează. Fără el, citirile de temperatură nu mai
ajung la punte.

1. Listează toate procesele care rulează pe computerul stației.
2. Filtrează acea listare doar la liniile care menționează reactorul și salvează-le
   într-un fișier numit `stare-reactor.txt`.
3. Creează un folder numit `verificare-stare` și mută `stare-reactor.txt` în el.
4. Numără câte procese de reactor au fost găsite.

**Rezultat așteptat**

`verificare-stare/stare-reactor.txt` conține linia pentru `/usr/bin/reactor-monitor`,
confirmând că daemonul este activ.
