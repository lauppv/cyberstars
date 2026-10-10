#include <stdio.h>

int main(void) {
    int n, x, total = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%d", &x); total += x; }
    printf("%d\n", total);
    return 0;
}
