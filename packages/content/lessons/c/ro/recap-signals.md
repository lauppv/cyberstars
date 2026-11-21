SIGCHLD, un ceas, sigsuspend și kill într-un singur program: lucrări care rulează în același timp, cu un singur termen comun

---

## Misiune: Termenul limită

Tura de noapte pornește toate lucrările deodată, dar sala mașinilor se închide peste o jumătate de secundă. Ce mai rulează atunci e oprit. Dimineața, șeful de tură vrea să știe care lucrări s-au terminat și cum

1. Instalează două handler-e cu sigaction. Handler-ul pentru SIGCHLD strânge într-o buclă copiii terminați cu waitpid, -1 și WNOHANG, găsește poziția fiecăruia după PID și îi salvează codul de ieșire. Handler-ul pentru SIGALRM doar pune un flag
2. Blochează SIGCHLD și SIGALRM. Citește comenzi, câte una pe linie, până se termină datele, și pornește fiecare comandă în copilul ei, cu execvp. Dacă exec eșuează, copilul iese cu 127
3. Pornește un ceas de 500 ms cu setitimer. Așteaptă cu sigsuspend până sunt strânși toți copiii sau până sună ceasul, care vine primul
4. Dacă a sunat ceasul, trimite SIGTERM fiecărui copil care nu s-a terminat, apoi așteaptă-l pe fiecare cu waitpid
5. Afișează câte o linie pentru fiecare comandă, în ordinea de la intrare: `iesire` și codul ei pentru o lucrare care s-a terminat singură, `oprita` pentru una pe care ai oprit-o tu. Apoi afișează cele două numere, ca în exemplu

Apelează fflush(stdout) înainte de fiecare fork. Sunt între 1 și 10 comenzi. Nu afișează nimic și nu citesc nimic

**Exemplu**

Intrare

```text
true
sleep 30
test 1 -gt 2
sleep 0
```

Ieșire

```text
1: iesire 0
2: oprita
3: iesire 1
4: iesire 0
Terminate: 3, oprite: 1
```
