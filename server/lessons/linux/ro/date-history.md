Pe o stație spațială contează să știi **când** se întâmplă lucrurile. Comanda
`date` afișează data și ora curentă:

```bash
date
```

```text
Mon Mar 17 14:32:01 UTC 2157
```

Comanda `uptime` îți spune de cât timp rulează sistemul de la ultima pornire:

```bash
uptime
```

```text
 14:32:01 up 42 days,  3:17,  1 user,  load average: 0.12, 0.08, 0.05
```

Această stație a fost online 42 de zile fără repornire — o stabilitate
impresionantă.

### Reactualizarea comenzilor anterioare

Comanda `history` arată fiecare comandă pe care ai tastat-o în sesiunea curentă
(și deseori și în cele precedente):

```bash
history
```

```text
    1  ls
    2  cd logs
    3  grep error sistem.log
    4  history
```

Poți rerula o comandă anterioară tastând `!NUMĂR`; de exemplu, `!3` ar rula din
nou `grep error sistem.log`. Asta economisește timp atunci când repeți comenzi
complexe.

---

## Misiune: Înregistrează marca temporală

Protocolul stației cere un jurnal de schimb scris la începutul fiecărei ture: ora
curentă, de cât timp este online stația și o revizuire a activității din terminal.

1. Înregistrează data și ora curentă într-un fișier nou numit `jurnal-schimb.txt`.
2. Adaugă la același fișier de cât timp rulează stația.
3. Creează un folder numit `evidente-schimb` și mută `jurnal-schimb.txt` în el.
4. Revizuiește lista numerotată cu comenzile pe care le-ai tastat în această sesiune.

**Rezultat așteptat**

`evidente-schimb/jurnal-schimb.txt` conține marca temporală urmată de timpul de
funcționare al stației.
