#include <stdio.h>

void statistici_matrice(int matrice[3][3], int *suma, int *min, int *max) {
}

int main(void) {
    int matrice[3][3] = {
        {5, 12, 3},
        {8, 1, 15},
        {7, 9, 4}
    };

    int suma, min, max;
    statistici_matrice(matrice, &suma, &min, &max);

    printf("Suma: %d\n", suma);
    printf("Min: %d\n", min);
    printf("Max: %d\n", max);

    return 0;
}
