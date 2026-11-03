#include <stdio.h>

int main(void) {
    int n, best = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x < best) best = x;
    }
    printf("%d\n", best);
    return 0;
}
