FCFS și SJF lasă un proces să ruleze până la capăt. Pe un calculator folosit de oameni, asta e o problemă: cât rulează o lucrare lungă, nimic altceva nu se mișcă, iar ecranul îngheață. Sistemele adevărate folosesc **preempțiunea**: planificatorul poate opri un proces la jumătate și poate da procesorul altcuiva

Cel mai simplu algoritm cu preempțiune e **Round Robin**. Fiecare proces primește o felie mică de timp, numită **cuantă** (quantum). Când i se termină felia și nu a terminat, merge la coada cozii, iar următorul își primește rândul. Toată lumea înaintează puțin, tot timpul

---

Cu o cuantă de 2

```text
nume  sosire  executie
P1       0       5
P2       1       3
P3       2       1
```

```text
0-2 P1
2-4 P2
4-5 P3
5-7 P1
7-8 P2
8-9 P1
```

La 0 e doar P1: rulează 2. Cât a rulat el, au sosit P2 și P3, deci ele sunt primele în coadă, iar P1 trece în spatele lor, cu 3 rămase. P2 rulează 2 și merge la coada cozii cu 1 rămas. P3 are nevoie doar de 1: termină înainte să i se termine felia, iar următorul pornește imediat. Apoi P1, P2, iar P1

---

Detaliile care hotărăsc ordinea

- Coada proceselor gata e „primul intrat, primul ieșit”. O putem ține ca un array cu un început și un sfârșit
- Când se termină o felie, adaugă întâi fiecare proces sosit **până în acel moment**, apoi pune procesul oprit la coada cozii
- Un proces care termină pleacă din coadă de tot
- Dacă coada e goală, procesorul stă degeaba până la următoarea sosire

---

Cuanta e un echilibru. Foarte mare, și Round Robin devine FCFS. Foarte mică, și procesorul își petrece mult timp trecând de la un proces la altul în loc să lucreze: fiecare trecere, o **schimbare de context** (context switch), costă ceva. Sistemele adevărate folosesc câteva milisecunde

Așteptarea medie la Round Robin e de obicei mai mare decât la SJF. În schimb, dă tuturor un prim răspuns rapid și nu înfometează pe nimeni: fiecare proces își primește rândul

---

## Misiune: Round Robin

Simulează Round Robin

1. Citește n și cuanta q, apoi n linii cu un nume, un timp de sosire și un timp de execuție
2. Pune procesele în coadă în ordinea sosirii, ordinea de la intrare hotărând la egalitate. Rulează-l pe primul din coadă q unități, sau mai puțin dacă îi trebuie mai puțin. Când se termină o felie, adaugă întâi procesele sosite până în acel moment, apoi pune procesul oprit la coada cozii, dacă nu a terminat
3. Afișează fiecare felie pe linia ei, chiar și când același proces rulează de două ori la rând, și `idle` când coada e goală
4. Apoi afișează timpii de așteptare și de răspuns ai fiecărui proces, în ordinea de la intrare, și cele două medii cu două zecimale, ca în lecția despre SJF

n e între 1 și 20, iar q între 1 și 10. Numele au cel mult 7 caractere. Timpii de sosire sunt între 0 și 100, iar cei de execuție între 1 și 50

**Exemplu**

Intrare

```text
3 2
P1 0 5
P2 1 3
P3 2 1
```

Ieșire

```text
0-2 P1
2-4 P2
4-5 P3
5-7 P1
7-8 P2
8-9 P1
P1: asteptare 4, raspuns 9
P2: asteptare 4, raspuns 7
P3: asteptare 2, raspuns 3
Asteptare medie: 3.33
Raspuns mediu: 6.33
```
