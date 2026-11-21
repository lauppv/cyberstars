```c
#include <stdio.h>

int numara_coloana(int plan[][10], int randuri, int col) {
    int numar = 0;
    for (int r = 0; r < randuri; r++) {
        if (plan[r][col] == 1) {
            numar++;
        }
    }
    return numar;
}

int main(void) {
    int randuri, coloane;
    int plan[10][10];
    scanf("%d %d", &randuri, &coloane);
    for (int r = 0; r < randuri; r++) {
        for (int c = 0; c < coloane; c++) {
            scanf("%d", &plan[r][c]);
        }
    }

    for (int r = 0; r < randuri; r++) {
        int unu = 0;
        for (int c = 0; c < coloane; c++) {
            unu = unu + plan[r][c];
        }
        printf("Randul %d: %d\n", r + 1, unu);
    }

    int maxim = 0;
    for (int c = 1; c < coloane; c++) {
        if (numara_coloana(plan, randuri, c) > numara_coloana(plan, randuri, maxim)) {
            maxim = c;
        }
    }
    printf("Cea mai plina coloana: %d\n", maxim + 1);
    return 0;
}
```
