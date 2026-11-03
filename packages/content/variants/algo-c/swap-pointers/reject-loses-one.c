#include <stdio.h>

static void swap(int *a, int *b) {
    *a = *b;
    *b = *a;
}

int main(void) {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("%d %d\n", x, y);
    return 0;
}
