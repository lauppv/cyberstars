# Easy · Bank Account

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

### Indicii

- Analizează fiecare linie de operație împărțind-o după spațiu.
- În `withdraw()`, verifică dacă amount <= balance înainte de a scădea.
- Soldul nu trebuie să devină niciodată negativ.
- Afișează `Insufficient funds` imediat ce o retragere eșuează.
