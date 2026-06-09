Combină **macro-urile de preprocesor**, **operațiile cu fișiere** și **operatorii pe biți**

---

## Misiune: Matricea de Control al Accesului

Sistemul de securitate al stației stochează nivelurile de acces ale echipajului într-un fișier de configurare. Rex are nevoie de un program care scrie matricea de acces pe disc, o citește înapoi și decodează flag-urile de permisiuni ale fiecărui membru al echipajului folosind operații pe biți.

Datele sunt deja în dreapta. Fă următoarele, în ordine:

1. Scrie **void afiseaza_permisiuni(const char \*nume, int permisiuni)** — folosește **&** pe biți ca să verifice fiecare flag și afișează permisiunile setate
2. Creează un fișier **"config.txt"** și scrie aceste 3 linii cu **fprintf**:
   - admin 7
   - editor 3
   - viewer 1
3. Citește fișierul înapoi cu **fscanf**
4. Pentru fiecare intrare, apelează **afiseaza_permisiuni** ca să decodezi flag-urile

Numărul **7** este **111** în binar (toate permisiunile). **3** este **011** (read + write). **1** este **001** (doar read)

**Output**

```text
admin: READ WRITE EXECUTE
editor: READ WRITE
viewer: READ
```
