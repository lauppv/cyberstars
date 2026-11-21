fork, exec, codul de ieșire și mai mulți copii care rulează deodată, într-un singur program

---

## Misiune: Verificările de dimineață

Înainte de prima tură, centrul de calcul rulează o listă de verificări rapide. Fiecare verificare e un program mic care nu afișează nimic: răspunde doar prin codul lui de ieșire, 0 când totul e bine. Verificările nu depind una de alta, așa că rulează toate în același timp

Verificările folosesc programul **test**. `test 5 -gt 3` iese cu 0 pentru că 5 e mai mare decât 3. `test -d /tmp` iese cu 0 dacă /tmp e un director, iar `test -f nume` dacă nume e un fișier obișnuit. Când răspunsul e nu, test iese cu 1

1. Citește verificări, câte una pe linie, până se termină datele. Fiecare linie e un program și argumentele lui, despărțite prin spații
2. Pornește întâi toate verificările, fiecare în copilul ei, cu execvp. Dacă exec eșuează, copilul iese cu 127 și nu afișează nimic
3. Apoi strânge toți copiii cu wait și potrivește fiecare PID cu verificarea lui
4. Afișează câte o linie pentru fiecare verificare, în ordinea de la intrare: `trecut` pentru codul 0, `lipsa` pentru 127 și `picat` pentru orice altceva. Apoi afișează câte au trecut, ca în exemplu

Apelează fflush(stdout) înainte de fiecare fork. Sunt între 1 și 10 verificări, fiecare cu cel mult 8 cuvinte și cel mult 100 de caractere

**Exemplu**

Intrare

```text
test 5 -gt 3
test -f ghost.txt
nosuchcheck
test -d /tmp
```

Ieșire

```text
1: trecut
2: picat
3: lipsa
4: trecut
Trecute: 2 din 4
```
