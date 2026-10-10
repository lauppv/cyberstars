#include <stdio.h>

int main(void) {
    int rows;
    scanf("%d", &rows);
    for (int r = 1; r <= rows; r++) {
        for (int c = 1; c <= r; c++)
            printf("%d ", c);
        putchar('\n');
    }
    return 0;
}
