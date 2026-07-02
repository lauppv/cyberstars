```c
#include <stdio.h>

void statistici_matrice(int matrice[3][3], int *suma, int *min, int *max) {
    *suma = 0;
    *min = matrice[0][0];
    *max = matrice[0][0];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            *suma = *suma + matrice[i][j];
            if (matrice[i][j] < *min) *min = matrice[i][j];
            if (matrice[i][j] > *max) *max = matrice[i][j];
        }
    }
}

int main(void) {
    int matrice[3][3];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            scanf("%d", &matrice[i][j]);
        }
    }

    int suma, min, max;
    statistici_matrice(matrice, &suma, &min, &max);

    printf("Suma: %d\n", suma);
    printf("Min: %d\n", min);
    printf("Max: %d\n", max);

    return 0;
}
```
