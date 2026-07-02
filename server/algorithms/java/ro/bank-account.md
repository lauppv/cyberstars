# Ușor · Cont bancar

Creează o clasă **BankAccount** cu un câmp `balance` și metodele `deposit(amount)` și `withdraw(amount)`. Retragerile trebuie respinse dacă suma depășește soldul curent (afișează `Insufficient funds`).

Citește soldul inițial pe prima linie, apoi procesează operațiile de la stdin. La final, afișează soldul final.

### Date de intrare

- Linia 1: soldul inițial (număr întreg)
- Linia 2: numărul de operații N
- Următoarele N linii: fie `deposit X`, fie `withdraw X`

### Rezultat

- Pentru fiecare retragere respinsă: `Insufficient funds`
- Ultima linie: `Balance: X`

### Exemple

```
Intrare:
100
3
deposit 50
withdraw 30
withdraw 200

Ieșire:
Insufficient funds
Balance: 120
```

```
Intrare:
0
2
deposit 500
withdraw 500

Ieșire:
Balance: 0
```

```
Intrare:
50
1
withdraw 50

Ieșire:
Balance: 0
```

Retragerea sumei **exacte** din sold este permisă — eșuează doar atunci când suma
este strict mai mare decât ce este disponibil.

```
Intrare:
10
2
withdraw 20
withdraw 15

Ieșire:
Insufficient funds
Insufficient funds
Balance: 10
```
