Combină **bucle imbricate**, **pointeri**, și **transmitere prin referință**

---

## Misiune: Analiza Grilei de Senzori

Grila de senzori 3x3 a stației tocmai a terminat o scanare de radiații. Tommy are nevoie de un diagnostic rapid: citirea totală, valoarea cea mai mică, și vârful cel mai mare. O singură funcție trebuie să returneze toate cele trei rezultate deodată prin pointeri.

Datele sunt deja în dreapta. Fă următoarele, în ordine:

1. Scrie **void statistici_matrice(int matrice[3][3], int *suma, int *min, int \*max)** folosind bucle imbricate ca să parcurgi matricea
2. Setează valorile sumei, minimului, și maximului prin pointeri
3. Apelează funcția din main și afișează rezultatele

**Output**

```text
Suma: 64
Min: 1
Max: 15
```

Funcția "returnează" trei valori deodată folosind pointeri — tiparul transmiterii prin referință
