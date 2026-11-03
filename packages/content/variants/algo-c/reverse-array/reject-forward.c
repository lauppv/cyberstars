#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        printf(i ? " %d" : "%d", x);
    }
    putchar('\n');
    return 0;
}
