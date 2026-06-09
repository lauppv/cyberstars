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
    3  grep error system.log
    4  history
```

Poți rerula o comandă anterioară tastând `!NUMĂR`; de exemplu, `!3` ar rula din
nou `grep error system.log`. Asta economisește timp atunci când repeți comenzi
complexe.

---

## Misiune: Înregistrează marca temporală

Protocolul stației cere înregistrarea datei și orei curente la începutul
fiecărui schimb, urmată de revizuirea activității recente din terminal.

1. Rulează `date` pentru a înregistra marca temporală curentă.
2. Rulează `history` pentru a vedea o evidență a comenzilor pe care le-ai tastat
   în această sesiune.

**Rezultat așteptat**

Vezi data și ora de astăzi, urmate de o listă numerotată cu toate comenzile din
sesiunea ta de până acum.
