FCFS, SJF și Round Robin unul lângă altul, fiecare scris ca o funcție pe care o poți apela pe aceleași procese

---

## Misiune: Concursul planificatorilor

Șeful de operațiuni trebuie să aleagă un planificator pentru noul mainframe. Primești un lot de lucrări adevărate și rulezi pe el cei trei algoritmi, ca să le compari timpii medii de așteptare

1. Citește n și o cuantă q, apoi n linii cu un nume, un timp de sosire și un timp de execuție
2. Scrie trei funcții, **fcfs**, **sjf** și **round_robin**, fiecare întorcând timpul total de așteptare al tuturor proceselor sub acel algoritm. Folosește aceleași reguli ca în lecții: la egalitate câștigă sosirea mai devreme, apoi ordinea de la intrare, iar la Round Robin sosirile noi intră în coadă înaintea procesului oprit
3. Afișează așteptarea medie a fiecăruia, cu două zecimale, apoi numele celui mai bun, cel cu media cea mai mică. Când două sunt egale, câștigă cel afișat primul

n e între 1 și 20, iar q între 1 și 10. Numele au cel mult 7 caractere. Timpii de sosire sunt între 0 și 100, iar cei de execuție între 1 și 50

**Exemplu**

Intrare

```text
4 2
P1 0 7
P2 1 4
P3 2 1
P4 3 4
```

Ieșire

```text
FCFS: 6.00
SJF: 5.25
RR: 6.25
Cel mai bun: SJF
```
