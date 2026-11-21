open, read, write, close, stat, unlink și readdir, cu errno pentru tot ce merge prost, într-o singură consolă

---

## Misiune: Consola bibliotecii de benzi

Biblioteca de benzi are o consolă pentru fișierele ei text. Operatorii scriu comenzi scurte, iar consola face treaba cu apeluri de sistem

1. Citește comenzi, câte una pe linie, până se termină datele, și execută-le
   - `write nume cuvant`: fă fișierul nou și gol și scrie în el cuvântul și o linie nouă
   - `append nume cuvant`: adaugă cuvântul și o linie nouă la finalul unui fișier care există deja. Nu-l crea
   - `show nume`: afișează ce e în fișier
   - `copy din in`: copiază fișierul din în fișierul in, făcut întâi nou și gol
   - `remove nume`: șterge fișierul
   - `list`: afișează fiecare fișier din directorul curent al cărui nume se termină cu `.txt`, în ordine alfabetică, fiecare cu mărimea lui. Apoi afișează `Fisiere: ` și câte au fost
2. Când o comandă eșuează, afișează comanda, numele cu care lucra și motivul dat de strerror, ca în exemplu. Pentru copy, acela e fișierul din. O comandă care reușește nu afișează nimic, în afară de show și list
3. Folosește open, read, write și close pentru fișiere, nu fopen

Pentru show, citește tot fișierul într-un buffer, termină-l cu un `'\0'` și afișează-l cu printf, ca să iasă în ordinea corectă față de celelalte linii ale tale. Fișierele au cel mult 4000 de bytes, numele cel mult 30 de caractere, iar cuvintele cel mult 20. Sunt cel mult 200 de comenzi

**Exemplu**

Intrare

```text
write crew.txt ada
append crew.txt ken
show crew.txt
copy crew.txt backup.txt
append ghost.txt x
list
remove crew.txt
list
show crew.txt
```

Ieșire

```text
ada
ken
append ghost.txt: No such file or directory
backup.txt 8
crew.txt 8
Fisiere: 2
backup.txt 8
Fisiere: 1
show crew.txt: No such file or directory
```
