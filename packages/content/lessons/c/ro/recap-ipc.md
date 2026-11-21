pipe, dup2, fork, exec și read lucrând împreună: un părinte care prinde ieșirea altui program și face ceva cu ea

---

## Misiune: Stația de releu

Stația de releu rulează programe pentru operatori și verifică ce afișează ele, fără să arate. Pentru fiecare program, raportează câte linii a afișat, suma numerelor întregi dintre acele linii și cum s-a terminat

1. Citește comenzi, câte una pe linie, până se termină datele. Fiecare e un program și argumentele lui, despărțite prin spații
2. Pentru fiecare comandă, fă un pipe și un fork. Copilul își îndreaptă stdout-ul spre pipe cu dup2 și rulează programul cu execvp. Dacă exec eșuează, iese cu 127
3. Părintele închide capătul de scriere, apoi citește tot din pipe cu read până când întoarce 0 și așteaptă copilul
4. În ce a afișat programul, numără liniile și adună fiecare linie care e un număr întreg, verificată cu strtol. Liniile care nu sunt numere se numără ca linii, dar nu adaugă nimic
5. Afișează comanda și rezultatele, ca în exemplu

Apelează fflush(stdout) înainte de fiecare fork. Un program afișează cel mult 60000 de bytes. Comenzile au cel mult 100 de caractere și 8 cuvinte

**Exemplu**

Intrare

```text
seq 4
echo tape 7
expr 6 * 7
nosuchcmd
```

Ieșire

```text
seq 4 -> linii 4, suma 10, iesire 0
echo tape 7 -> linii 1, suma 0, iesire 0
expr 6 * 7 -> linii 1, suma 42, iesire 0
nosuchcmd -> linii 0, suma 0, iesire 127
```

„tape 7” nu e un număr întreg, deci nu adaugă nimic. Împărțirea liniei cu strtok o schimbă, așa că păstrează o copie a comenzii ca s-o afișezi
