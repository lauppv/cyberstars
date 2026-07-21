# Mediu · Sortare cu bule

Implementează algoritmul **bubble sort**. Citește un tablou de numere întregi și sortează-le în ordine crescătoare folosind bubble sort, apoi afișează tabloul sortat.

Bubble sort funcționează parcurgând repetat lista, comparând elementele adiacente și interschimbându-le dacă sunt în ordine greșită. Parcurgerea listei se repetă până când lista este sortată.

### Date de intrare

- Linia 1: numărul întreg N — numărul de elemente
- Următoarele N linii: câte un număr întreg

### Rezultat

- Numerele întregi sortate pe o singură linie, separate prin spații.

### Exemple

```
Intrare:
5
5
3
8
1
2

Ieșire:
1 2 3 5 8
```

```
Intrare:
3
3
2
1

Ieșire:
1 2 3
```

```
Intrare:
1
7

Ieșire:
7
```

Un tablou cu un singur element este deja sortat — nu e nevoie de nicio interschimbare.

```
Intrare:
4
2
2
1
1

Ieșire:
1 1 2 2
```

Valorile duplicate sunt tratate la fel ca orice altă comparație — se
interschimbă doar când sunt strict mai mari.
