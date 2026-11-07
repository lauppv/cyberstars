Capitolul 6 te-a înarmat cu un set complet de unelte pentru procesarea textului:

| Comandă | Superputere                                          |
| ------- | ---------------------------------------------------- |
| `sort`  | Reordonează linii (alfabetic, numeric, după coloană) |
| `uniq`  | Elimină/numără duplicate (după sortare)              |
| `cut`   | Extrage coloane după delimitator sau poziție         |
| `sed`   | Caută și înlocuiește într-un flux                    |
| `awk`   | Procesare de câmpuri, calcule, filtrare              |

Aceste comenzi **se combină** frumos prin pipe-uri. Un singur pipeline poate
transforma date brute într-un raport curat.

---

## Misiune: Raportul Activității Echipajului

Administratorul stației are nevoie de un rezumat al activității echipajului din `date_brute.csv`, care înregistrează câte o sarcină pe linie: cine a făcut-o, ce fel de sarcină și de câte ori. Nu e sortat, iar numele se repetă. Fă două fișiere, fiecare direct din date:

- `raport.txt`: fiecare membru al echipajului o singură dată, cu câte înregistrări are, cel mai activ primul;
- `total-scanari.txt`: doar numărul, câte scanări a făcut echipajul în total, adunând ultima coloană a fiecărei înregistrări `scanare`.

**Rezultat așteptat**

`raport.txt` are câte o linie pentru fiecare membru al echipajului cu numărul lui de înregistrări, cel mai activ sus, iar `total-scanari.txt` ține un singur număr.
