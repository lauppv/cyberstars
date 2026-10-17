Pune cap la cap lecțiile despre grafuri: o hartă, citită o singură dată, și trei întrebări despre ea, fiecare cu parcurgerea făcută pentru ea

---

Pe scurt, piesele

- **Citirea unui graf**: **n** și **m** pe prima linie, apoi câte o muchie pe linie; o muchie cu cost are un al treilea număr, costul ei
- **Lista de adiacență**: câte un rând dintr-un array pentru fiecare nod, un număr care spune câți vecini ține și un al doilea array lângă el pentru costuri; într-un graf neorientat fiecare muchie intră în ambele rânduri
- **Parcurgerea în lățime**: o coadă făcută dintr-un array, **inceput** și **sfarsit**, și un **-1** pentru fiecare nod încă nevăzut; dă cele mai puține muchii de la start
- **Parcurgerea în adâncime**: o funcție recursivă care marchează un nod și se apelează pe fiecare vecin încă nemarcat; o parcurgere nouă din fiecare nod la care n-a ajuns nicio parcurgere numără bucățile
- **Algoritmul lui Dijkstra**: la fiecare pas, treci prin toate nodurile și îl iei pe cel neterminat cu cea mai mică distanță; dă cel mai mic cost total de la start

---

## Misiune: Cercetează harta

1. Citește un graf neorientat cu costuri cu **scanf**: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie, **u v c**, iar după ele o linie cu nodul de start **s**
2. Numără bucățile grafului cu o parcurgere în adâncime recursivă și afișează **Bucati:** și câte sunt
3. Află cele mai puține muchii de la **s** la fiecare nod cu o parcurgere în lățime, folosind o coadă, și afișează **Pasi:** și numerele, de la nodul **0** la **n - 1**
4. Află cea mai mică distanță de la **s** la fiecare nod cu algoritmul lui Dijkstra, alegând următorul nod trecând prin toate, și afișează **Distante:** și numerele, de la nodul **0** la **n - 1**

Un nod la care nu se poate ajunge de la **s** primește **-1** pe ambele linii

**n** este de la 1 la 8, iar nodurile sunt numerotate de la 0 la **n - 1**. Fiecare cost este un număr întreg de la 1 la 100. Nicio muchie nu unește un nod cu el însuși și nicio pereche de noduri nu e unită de două ori. **m** poate fi 0

**Exemplu**

Intrare

```text
6 6
0 1 4
0 2 1
1 2 2
1 3 5
2 3 8
3 4 3
0
```

Ieșire

```text
Bucati: 2
Pasi: 0 1 1 2 3 -1
Distante: 0 3 1 8 11 -1
```

**Exemplu**

Intrare

```text
5 4
0 1 10
0 2 1
2 3 1
3 1 1
0
```

Ieșire

```text
Bucati: 2
Pasi: 0 1 1 2 -1
Distante: 0 3 1 2 -1
```
