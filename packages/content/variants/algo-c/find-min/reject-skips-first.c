#include <limits.h>
#include <stdio.h>

int main(void) {
    int n, x, best = INT_MAX;
    scanf("%d", &n);
    scanf("%d", &x);
    for (int i = 1; i < n; i++) {
        scanf("%d", &x);
        if (x < best) best = x;
    }
    printf("%d\n", n == 1 ? x : best);
    return 0;
}
