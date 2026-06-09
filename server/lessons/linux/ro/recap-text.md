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

## Misiune: Raport activitate echipaj

Administratorul stației are nevoie de un rezumat al activității echipajului din `raw_data.csv`. Fișierul conține înregistrări separate prin virgulă (`name,action,count`), dar unele intrări sunt duplicate și nu e sortat. Transformă aceste date brute într-un raport curat — într-un singur pipeline.

Folosește `cut` ca să extragi doar coloana cu nume (câmpul 1, delimitat prin virgulă), trimite prin pipe la `sort`, apoi la `uniq -c` ca să numere aparițiile și redirectează rezultatul în `report.txt` cu `>`.

**Rezultat așteptat**

Rulând `cat report.txt` se afișează numele fiecărui membru al echipajului împreună cu un număr: Chen apare de 2 ori, Tanaka de 2 ori, iar Voss de 3 ori.
