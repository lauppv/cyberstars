Recursivitatea merge și pe array-uri. Trucul e același: rezolvăm o copie mai mică a problemei. Pentru un array cu n valori, copia mai mică e același array, cu o valoare mai puțin

```c
#include <stdio.h>

int suma(int v[], int n) {
    if (n == 0) {
        return 0;
    }
    return v[n - 1] + suma(v, n - 1);
}

int main(void) {
    int v[] = { 4, 8, 15, 16 };
    printf("%d\n", suma(v, 4));
    return 0;
}
```

Ieșire

```text
43
```

Suma a 4 valori e ultima valoare plus suma primelor 3. Suma a 0 valori e 0, acesta e cazul de bază. Nu copiem niciodată array-ul: fiecare apel primește același array și doar un n mai mic

---

Cea mai mare valoare se găsește la fel. Cea mai mare din n valori e cea mai mare dintre două lucruri: ultima valoare și cea mai mare dintre primele n - 1

```c
#include <stdio.h>

int maxim(int v[], int n) {
    if (n == 1) {
        return v[0];
    }
    int rest = maxim(v, n - 1);
    return v[n - 1] > rest ? v[n - 1] : rest;
}

int main(void) {
    int v[] = { 23, 42, 7, 19 };
    printf("%d\n", maxim(v, 4));
    return 0;
}
```

Ieșire

```text
42
```

Aici cazul de bază e n == 1: o singură valoare e mereu cea mai mare dintre ea însăși. Un array gol nu are o valoare maximă, deci funcția are nevoie ca n să fie cel puțin 1

---

Uneori o singură mărime nu ajunge și trimitem două poziții: unde începe bucata și unde se termină. Se citește un cuvânt la fel de la ambele capete? Comparăm prima și ultima literă, apoi verificăm bucata dintre ele

```c
#include <stdio.h>
#include <string.h>

int e_oglinda(char cuvant[], int stanga, int dreapta) {
    if (stanga >= dreapta) {
        return 1;
    }
    if (cuvant[stanga] != cuvant[dreapta]) {
        return 0;
    }
    return e_oglinda(cuvant, stanga + 1, dreapta - 1);
}

int main(void) {
    char a[] = "level";
    char b[] = "lever";
    printf("%d\n", e_oglinda(a, 0, strlen(a) - 1));
    printf("%d\n", e_oglinda(b, 0, strlen(b) - 1));
    return 0;
}
```

Ieșire

```text
1
0
```

Fiecare apel aduce ambele capete cu un pas mai aproape. Când se întâlnesc sau se încrucișează, nu mai e nimic de comparat, deci răspunsul e da

---

## Misiune: Jurnalul senzorului

Un senzor de temperatură din sala mașinilor scrie o citire în fiecare minut. Șeful de tură vrea două răspunsuri din jurnal: câte citiri au trecut peste o limită și dacă temperatura doar a urcat, fără să coboare vreodată

1. Citește două numere întregi de la input: n, numărul de citiri, și limita. Apoi citește cele n citiri într-un array
2. Scrie o funcție recursivă **int numara_peste(int v[], int n, int limita)** care întoarce câte dintre primele n citiri sunt mai mari decât limita
3. Scrie o funcție recursivă **int e_crescator(int v[], int n)** care întoarce 1 când fiecare dintre primele n citiri e mai mare sau egală cu cea dinaintea ei, și 0 altfel. O singură citire contează ca fiind crescătoare
4. Afișează cele două răspunsuri, ca în exemplu. Folosește bucle doar ca să citești datele

n e între 1 și 100

**Exemplu**

Intrare

```text
5 30
22 28 31 31 40
```

Ieșire

```text
Peste 30: 3
Crescator: da
```

**Exemplu**

Intrare

```text
4 25
26 24 27 30
```

Ieșire

```text
Peste 25: 3
Crescator: nu
```
