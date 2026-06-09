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

Coloanele îți spun: **cine** deține procesul, PID-ul său, consumul de resurse și
comanda care l-a pornit. Când stația merge greoi, `ps aux` este prima ta unealtă
de diagnoză.

---

## Misiune: Verificare medicală a inginerilor

Inginerii tocmai au transmis prin radio — au nevoie să confirmi că daemonul de
monitorizare a reactorului încă rulează. Fără el, citirile de temperatură nu mai
ajung la punte.

Rulează `ps aux` pentru a lista toate procesele de pe computerul stației.
Caută în output orice proces a cărui comandă conține `reactor`.

**Rezultat așteptat**

Ar trebui să vezi un proces care rulează `/usr/bin/reactor-monitor --port=7700`
deținut de `root`. Raportează confirmarea către ingineri.
