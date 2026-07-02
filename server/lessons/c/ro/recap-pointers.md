Combină **bucle imbricate**, **pointeri**, și **transmitere prin referință**

---

## Misiune: Diagnosticul benzii de memorie

Un bloc de memorie de 3x3 celule tocmai a fost citit de pe bandă. Înainte să-l arhivezi, ai nevoie de un diagnostic rapid: suma tuturor celulelor, valoarea cea mai mică, și vârful cel mai mare. O singură funcție trebuie să calculeze toate cele trei rezultate deodată, prin pointeri.

1. Citește 9 numere întregi din input, câte 3 pe fiecare din cele 3 linii, într-un tablou **int matrice[3][3]**
2. Scrie **void statistici_matrice(int matrice[3][3], int \*suma, int \*min, int \*max)** folosind bucle imbricate ca să parcurgi matricea
3. Setează valorile sumei, minimului, și maximului prin pointeri
4. Apelează funcția din **main** și afișează rezultatele, exact în formatul din exemplu

**Exemplu**

Input

```text
5 12 3
8 1 15
7 9 4
```

Output

```text
Suma: 64
Min: 1
Max: 15
```

**Exemplu**

Input

```text
2 4 6
8 10 12
14 16 18
```

Output

```text
Suma: 90
Min: 2
Max: 18
```

Funcția "returnează" trei valori deodată folosind pointeri — tiparul transmiterii prin referință
