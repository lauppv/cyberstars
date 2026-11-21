#include <stdio.h>

int main(void) {
    unsigned long sz, a;
    int n, t[64], faults = 0;
    scanf("%lu %d", &sz, &n);
    for (int i = 0; i < n; i++) scanf("%d", &t[i]);
    int bits = __builtin_ctzl(sz);
    while (scanf("%lu", &a) == 1) {
        unsigned long pg = a >> bits, off = a & (sz - 1);
        printf("%lu: page %lu, offset %lu -> ", a, pg, off);
        if (pg < (unsigned long)n && t[pg] >= 0) printf("%lu\n", ((unsigned long)t[pg] << bits) | off);
        else { puts("page fault"); faults++; }
    }
    printf("Page faults: %d\n", faults);
    return 0;
}
