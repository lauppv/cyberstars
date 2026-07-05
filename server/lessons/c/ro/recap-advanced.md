Combină **macro-urile de preprocesor**, **operațiile cu fișiere** și **operatorii pe biți**

---

## Misiune: Matricea de control al accesului

Centrul de calcul stochează nivelurile de acces ale conturilor într-un fișier de configurare. Ai nevoie de un program care citește conturile de la operator, le scrie pe disc, le citește înapoi și decodează flag-urile de permisiuni ale fiecărui cont folosind operații pe biți.

Fă următoarele, în ordine:

1. Scrie **void afiseaza_permisiuni(const char \*nume, int permisiuni)** — folosește **&** pe biți ca să verifice fiecare flag și afișează permisiunile setate
2. Citește perechi **nume permisiuni** din input, câte una pe linie, până la sfârșitul intrării (folosește `while (scanf("%s %d", nume, &permisiuni) == 2)`)
3. Pentru fiecare pereche citită, scrie-o cu **fprintf** într-un fișier **"config.txt"**
4. După ce ai scris toate perechile, închide fișierul, apoi deschide-l din nou pentru **citire**
5. Citește fiecare pereche înapoi cu **fscanf** și apelează **afiseaza_permisiuni** pentru fiecare, ca să decodezi flag-urile

Numărul **7** este **111** în binar (toate permisiunile). **3** este **011** (read + write). **1** este **001** (doar read)

**Exemplu**

Intrare

```text
admin 7
editor 3
viewer 1
```

Ieșire

```text
admin: READ WRITE EXECUTE
editor: READ WRITE
viewer: READ
```

**Exemplu**

Intrare

```text
root 4
guest 2
ops 6
```

Ieșire

```text
root: EXECUTE
guest: WRITE
ops: WRITE EXECUTE
```
