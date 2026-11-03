#include <stdio.h>
#include <stdlib.h>

static int up(const void *x, const void *y) {
    int a = *(const int *)x, b = *(const int *)y;
    return (a > b) - (a < b);
}

int main(void) {
    int n;
    static int a[30000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < 1; j++) scanf("%d", &a[i]);
    }
    qsort(a, n, sizeof(int), up);
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    putchar('\n');
    return 0;
}
