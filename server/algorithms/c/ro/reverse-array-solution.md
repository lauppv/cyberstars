```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int vector[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &vector[i]);
    }

    // Parcurgem tabloul de la coada spre cap si afisam fiecare element.
    for (int i = n - 1; i >= 0; i--) {
        printf("%d", vector[i]);
        if (i > 0) {
            printf(" ");
        }
    }
    printf("\n");

    return 0;
}
```
