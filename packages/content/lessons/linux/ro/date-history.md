Pe o stație spațială contează să știi când se întâmplă lucrurile. Comanda
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

Această stație a fost online 42 de zile fără repornire, o stabilitate
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

Ca să rulezi din nou o comandă anterioară, apasă săgeata în sus: fiecare apăsare
aduce comanda dinainte, gata de modificat sau de rulat cu Enter. Asta economisește
timp atunci când repeți comenzi complexe.

---

## Misiune: Înregistrează Ora

Protocolul stației cere un jurnal de tură scris la începutul fiecărei gărzi. Scrie `evidente-schimb/jurnal-schimb.txt` cu data și ora curentă pe prima linie și de cât timp funcționează stația pe a doua. Apoi revezi lista numerotată a comenzilor pe care le-ai tastat în sesiunea asta.

**Rezultat așteptat**

`evidente-schimb/jurnal-schimb.txt` are două linii, ora și apoi timpul de funcționare al stației, iar tu ți-ai văzut comenzile numerotate.
