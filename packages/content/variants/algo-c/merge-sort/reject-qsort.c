#include <stdio.h>
#include <stdlib.h>

static int up(const void *x, const void *y) {
    int a = *(const int *)x, b = *(const int *)y;
    return (a > b) - (a < b);
}

static void read_all(int *a, int i, int n) {
    if (i == n) return;
    scanf("%d", &a[i]);
    read_all(a, i + 1, n);
}

int main(void) {
    int n;
    static int a[20000];
    scanf("%d", &n);
    read_all(a, 0, n);
    qsort(a, n, sizeof(int), up);
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    putchar('\n');
    return 0;
}
