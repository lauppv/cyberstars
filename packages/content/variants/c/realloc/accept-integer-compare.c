#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t cap = 2, n = 0;
    int *a = malloc(cap * sizeof *a);
    if (!a) return 1;
    int x;
    long total = 0;
    while (scanf("%d", &x) == 1) {
        if (n == cap) {
            int *t = realloc(a, 2 * cap * sizeof *a);
            if (!t) { free(a); return 1; }
            a = t;
            cap *= 2;
        }
        a[n++] = x;
        total += x;
    }
    printf("Values: %zu\nCapacity: %zu\nAbove average:", n, cap);
    int any = 0;
    for (size_t i = 0; i < n; i++)
        if ((long)a[i] * (long)n > total) { printf(" %d", a[i]); any = 1; }
    puts(any ? "" : " none");
    free(a);
    return 0;
}
