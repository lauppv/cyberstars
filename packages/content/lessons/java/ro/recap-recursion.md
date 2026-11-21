Pune recursivitatea la lucru pe o problemă unde buclele se împotmolesc: încercarea tuturor posibilităților, o alegere pe rând

---

## Misiune: Spărgătorul de seifuri

Tommy stă în fața seifului lui Diaz. Combinația are un număr știut de cifre, iar informatorul lui jură că cifrele adunate dau un număr știut. Tommy vrea lista tuturor combinațiilor care se potrivesc, ca să le încerce pe rând.

Stochează numărul de cifre într-un `int` numit `lungime` și suma cifrelor într-un `int` numit `tinta`. Afișează fiecare combinație de `lungime` cifre, fiecare cifră de la 0 la 9, ale cărei cifre adunate dau `tinta`, de la cea mai mică la cea mai mare. Zerourile din față contează, deci `03` e o combinație de 2 cifre. Apoi afișează `Gasite: N`.

Numărul de cifre se schimbă, așa că nu poți scrie câte o buclă pentru fiecare cifră. Scrie o metodă recursivă care alege o cifră, apoi lasă apelul următor să aleagă restul. Fă-o să dea înapoi câte combinații a găsit.

**Exemplu** pentru `lungime = 2` și `tinta = 3`

```text
03
12
21
30
Gasite: 4
```

**Exemplu** pentru `lungime = 3` și `tinta = 1`

```text
001
010
100
Gasite: 3
```

**Exemplu** pentru `lungime = 1` și `tinta = 12`

```text
Gasite: 0
```
