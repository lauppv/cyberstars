```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int vector[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &vector[i]);
    }

    int cautat;
    scanf("%d", &cautat);

    int stanga = 0, dreapta = n - 1;
    int rezultat = -1;

    while (stanga <= dreapta) {
        int mijloc = stanga + (dreapta - stanga) / 2;
        if (vector[mijloc] == cautat) {
            rezultat = mijloc;
            break;
        } else if (vector[mijloc] < cautat) {
            stanga = mijloc + 1;
        } else {
            dreapta = mijloc - 1;
        }
    }

    printf("%d\n", rezultat);
    return 0;
}
```
