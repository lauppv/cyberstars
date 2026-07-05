Când treci o variabilă către o funcție, funcția primește o **copie**. Pointerii ne lasă să facem ceva special: **transmitere prin referință**

Mai întâi, hai să vedem problema. Această funcție încearcă să interschimbe două numere dar **eșuează**

```c
#include <stdio.h>

void interschimba(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main(void) {
    int x = 10, y = 20;
    interschimba(x, y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

Ieșire

```text
x = 10, y = 20
```

Nu s-a întâmplat nimic! Funcția a interschimbat **copiile locale**, dar **x** și **y** originali nu s-au schimbat. Copiile au fost distruse când funcția s-a încheiat

---

Soluția: **transmite pointeri** în loc de valori

```c
#include <stdio.h>

void interschimba(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 10, y = 20;
    interschimba(&x, &y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

Ieșire

```text
x = 20, y = 10
```

Acum funcționează. Am transmis **adresele** lui x și y. Funcția a urmat acele adrese și a schimbat valorile reale. Aceasta este **transmiterea prin referință** — cea mai importantă utilizare a pointerilor

---

Acest tipar este peste tot în C. Vrei ca o funcție să modifice o variabilă? Transmite-i adresa

```c
#include <stdio.h>

void dubleaza(int *n) {
    *n = *n * 2;
}

int main(void) {
    int scor = 50;
    dubleaza(&scor);
    printf("%d\n", scor);   // 100
    return 0;
}
```

Altă utilizare comună: funcții care trebuie să **returneze mai multe valori**. O funcție din C poate returna doar un singur lucru, dar cu pointeri putem "returna" câte vrem

```c
#include <stdio.h>

void min_max(int tablou[], int n, int *min, int *max) {
    *min = tablou[0];
    *max = tablou[0];
    for (int i = 1; i < n; i++) {
        if (tablou[i] < *min) *min = tablou[i];
        if (tablou[i] > *max) *max = tablou[i];
    }
}

int main(void) {
    int numere[] = {3, 7, 1, 9, 4};
    int lo, hi;
    min_max(numere, 5, &lo, &hi);
    printf("Min: %d, Max: %d\n", lo, hi);
    return 0;
}
```

Ieșire

```text
Min: 1, Max: 9
```

Funcția "returnează" atât minimul cât și maximul prin pointeri. Este idiomatic în C — vei vedea asta peste tot

---

## Misiune: Amplificatorul de semnal

La centrul de calcul, un traductor de semnal citește o valoare brută de pe bandă magnetică. Amplificatorul trebuie s-o **tripleze** înainte de a o trimite mai departe — dar accesul direct la variabilă nu e permis, doar prin pointer.

1. Citește un **int** **semnal** din input
2. Scrie o funcție **tripleaza** care primește un **pointer la int** și triplează valoarea către care pointează
3. Apelează **tripleaza(&semnal)** din **main**
4. Afișează rezultatul

**Exemplu**

Intrare

```text
5
```

Ieșire

```text
15
```

**Exemplu**

Intrare

```text
10
```

Ieșire

```text
30
```
