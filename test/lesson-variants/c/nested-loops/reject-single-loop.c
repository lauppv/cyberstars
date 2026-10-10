#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int row = 1, col = 1;
    for (; row <= n;) {
        printf(col == 1 ? "%d" : " %d", col);
        if (col == row) {
            printf("\n");
            row++;
            col = 1;
        } else {
            col++;
        }
    }
    return 0;
}
