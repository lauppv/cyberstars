Cu malloc, trebuie să știm mărimea înainte să cerem memorie. Dar uneori aflăm abia în timp ce citim: valorile tot vin până se termină datele. Am putea cere un bloc uriaș, pentru orice eventualitate, dar așa irosim memorie și s-ar putea să fie tot prea mic

Soluția e să pornim cu puțin și să mărim blocul când se umple. Asta face **realloc**

---

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *v = malloc(2 * sizeof(int));
    v[0] = 10;
    v[1] = 20;

    v = realloc(v, 4 * sizeof(int));
    v[2] = 30;
    v[3] = 40;

    for (int i = 0; i < 4; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
    free(v);
    return 0;
}
```

Ieșire

```text
10 20 30 40
```

`realloc(v, marime_noua)` ne dă înapoi un bloc de mărimea nouă, cu valorile vechi încă în el. Partea nouă, de după ele, conține gunoi până scriem ceva acolo

---

Există o capcană. Dacă imediat după blocul vechi nu e loc liber, realloc găsește alt loc, copiază totul acolo și eliberează blocul vechi. Deci adresa se poate schimba. De aceea folosim mereu pointerul întors de realloc și îl uităm pe cel vechi

Iar dacă nu mai e deloc memorie, realloc întoarce NULL, dar blocul vechi e tot acolo. Dacă am fi scris `v = realloc(v, ...)` și am fi primit NULL, am pierde singurul pointer spre blocul vechi, iar memoria lui s-ar pierde (leak). Calea sigură folosește un al doilea pointer

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *v = malloc(2 * sizeof(int));
    v[0] = 10;
    v[1] = 20;

    int marime_noua = 4 * sizeof(int);
    int *mai_mare = realloc(v, marime_noua);
    if (mai_mare == NULL) {
        free(v);
        return 1;
    }
    v = mai_mare;

    v[2] = 30;
    v[3] = 40;
    for (int i = 0; i < 4; i++) {
        printf("%d\n", v[i]);
    }
    free(v);
    return 0;
}
```

Ieșire

```text
10
20
30
40
```

---

Cât să creștem de fiecare dată? Dacă am crește cu un loc de fiecare dată, am apela realloc pentru fiecare valoare, iar fiecare apel poate copia tot array-ul. Trucul obișnuit e să **dublăm** mărimea când array-ul e plin. Ținem două numere: câte valori avem, numărul, și câte încap, **capacitatea**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacitate = 2;
    int numar = 0;
    int *v = malloc(capacitate * sizeof(int));

    for (int x = 1; x <= 5; x++) {
        if (numar == capacitate) {
            capacitate = capacitate * 2;
            v = realloc(v, capacitate * sizeof(int));
            printf("a crescut la %d\n", capacitate);
        }
        v[numar] = x;
        numar++;
    }

    printf("%d valori, loc pentru %d\n", numar, capacitate);
    free(v);
    return 0;
}
```

Ieșire

```text
a crescut la 4
a crescut la 8
5 valori, loc pentru 8
```

Cinci valori, doar două apeluri ale lui realloc. Pentru un milion de valori, dublarea are nevoie de vreo 20 de apeluri

---

## Misiune: Banda fără sfârșit

Un senzor își scrie citirile pe o bandă și nimeni nu știe cât de lungă e banda. Tehnicienii vor să afle media citirilor și care citiri au fost peste ea. Ca să le găsim, toate citirile trebuie păstrate până la final

1. Citește numere întregi până se termină datele. Ține-le într-un array care pornește cu loc pentru 2 valori și își dublează capacitatea cu realloc de fiecare dată când se umple
2. Afișează câte valori au fost și capacitatea de la final, ca în exemplu
3. Afișează valorile mai mari decât media tuturor, în ordinea în care au venit, despărțite prin spații. Dacă nu e niciuna, afișează `niciuna`
4. Eliberează array-ul la final

Există cel puțin o valoare și cel mult 10000. Fiecare e între -1000 și 1000

**Exemplu**

Intrare

```text
4 9 1 7 3
```

Ieșire

```text
Valori: 5
Capacitate: 8
Peste medie: 9 7
```

Aici media e 24 / 5 = 4.8, deci 9 și 7 sunt peste ea
