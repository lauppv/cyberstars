#include <stdio.h>
#include <stdlib.h>

int push(int *v, int n, int value) { v[n] = value; return n + 1; }

int main(void) {
    int *v = malloc(1000 * sizeof(int)), n = 0, x, total = 0;
    while (scanf("%d", &x) == 1) n = push(v, n, x);
    for (int i = n - 1; i >= 0; i--) { printf("%d -> ", v[i]); total += v[i]; }
    printf("NULL\nLength: %d\nTotal: %d\n", n, total);
    free(v);
    return 0;
}
