```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int vector[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &vector[i]);
    }

    for (int i = 1; i < n; i++) {
        int cheie = vector[i];
        int j = i - 1;
        while (j >= 0 && vector[j] > cheie) {
            vector[j + 1] = vector[j];
            j--;
        }
        vector[j + 1] = cheie;
    }

    for (int i = 0; i < n; i++) {
        printf("%d", vector[i]);
        if (i < n - 1) {
            printf(" ");
        }
    }
    printf("\n");

    return 0;
}
```
