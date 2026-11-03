#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    int *values = (int *)malloc((size_t)n * sizeof *values);
    if (!values) return 1;
    for (int *p = values; p < values + n; p++) scanf("%d", p);
    long long total = 0;
    for (int i = 0; i < n; i++) total += values[i];
    free(values);
    printf("%lld\n%.2f\n", total, (double)total / n);
    return 0;
}
