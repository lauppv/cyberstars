#include <stdio.h>

int main(void) {
    int n, x, best;
    scanf("%d", &n);
    scanf("%d", &best);
    for (int i = 1; i < n; i++) {
        scanf("%d", &x);
        if (x < best) best = x;
    }
    printf("Min: %d\n", best);
    return 0;
}
