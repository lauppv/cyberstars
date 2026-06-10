# Easy · Bubble Sort

Implementează algoritmul **bubble sort**. Citește un tablou de numere întregi și sortează-le în ordine crescătoare folosind bubble sort, apoi afișează tabloul sortat.

Bubble sort funcționează parcurgând repetat lista, comparând elementele adiacente și interschimbându-le dacă sunt în ordine greșită. Parcurgerea listei se repetă până când lista este sortată.

### Date de intrare

- Linia 1: numărul întreg N — numărul de elemente
- Linia 2: N numere întregi separate prin spațiu

### Rezultat

- Numerele întregi sortate pe o singură linie, separate prin spații.

### Exemple

```
Intrare:
5
5 3 8 1 2

Ieșire:
1 2 3 5 8
```

```
Intrare:
3
3 2 1

Ieșire:
1 2 3
```

### Indicii

- Folosește două bucle imbricate: bucla exterioară rulează de N-1 ori, bucla interioară compară elementele adiacente.
- Dacă `arr[j] > arr[j+1]`, interschimbă-le.
- După fiecare parcurgere a buclei exterioare, cel mai mare element nesortat „urcă la suprafață” în poziția sa corectă.
- Poți optimiza oprindu-te din timp dacă nu apare nicio interschimbare într-o parcurgere — tabloul este deja sortat.
- Folosește `System.out.print` cu spații între elemente (fără spațiu la final).
