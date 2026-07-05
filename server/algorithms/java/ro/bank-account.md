# Ușor · Cont bancar

Creează o clasă **ContBancar** cu un câmp `sold` și metodele `depune(suma)` și `retrage(suma)`. Retragerile trebuie respinse dacă suma depășește soldul curent (afișează `Fonduri insuficiente`).

Citește soldul inițial pe prima linie, apoi procesează operațiile de la stdin. La final, afișează soldul final.

### Date de intrare

- Linia 1: soldul inițial (număr întreg)
- Linia 2: numărul de operații N
- Pentru fiecare operație, două linii:
  - Linia 1: tipul operației (`depune` sau `retrage`)
  - Linia 2: suma (număr întreg)

### Rezultat

- Pentru fiecare retragere respinsă: `Fonduri insuficiente`
- Ultima linie: `Sold: X`

### Exemple

```
Intrare:
100
3
depune
50
retrage
30
retrage
200

Ieșire:
Fonduri insuficiente
Sold: 120
```

```
Intrare:
0
2
depune
500
retrage
500

Ieșire:
Sold: 0
```

```
Intrare:
50
1
retrage
50

Ieșire:
Sold: 0
```

Retragerea sumei **exacte** din sold este permisă — eșuează doar atunci când suma
este strict mai mare decât ce este disponibil.

```
Intrare:
10
2
retrage
20
retrage
15

Ieșire:
Fonduri insuficiente
Fonduri insuficiente
Sold: 10
```
