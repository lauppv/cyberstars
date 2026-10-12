```c
#include <stdio.h>

int main(void) {
    int matrice[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    int n = 3;

    // Transpusa: elementul de pe [i][j] devine [j][i].
    // Afisam matrice[j][i] pe pozitia (i, j) a rezultatului.
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d", matrice[j][i]);
            if (j < n - 1) {
                printf(" ");
            }
        }
        printf("\n");
    }

    return 0;
}
```
