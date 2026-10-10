#include <stdio.h>

static void print_row(int len) {
    for (int k = 0; k < len; k++) {
        printf(k == 0 ? "%d" : " %d", k + 1);
    }
    printf("\n");
}

int main(void) {
    int lines;
    scanf("%d", &lines);
    for (int row = 0; row < lines; row++) print_row(row + 1);
    return 0;
}
