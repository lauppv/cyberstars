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

    // Tinem doi indicatori: stanga si dreapta. In fiecare pas taiem intervalul la jumatate.
    int stanga = 0;
    int dreapta = n - 1;
    int rezultat = -1;

    while (stanga <= dreapta) {
        // stanga + (dreapta - stanga) / 2 evita overflow-ul care ar aparea
        // cu (stanga + dreapta) / 2 pentru numere foarte mari.
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
