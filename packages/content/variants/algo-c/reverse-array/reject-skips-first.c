#include <stdio.h>

int main(void) {
    int n;
    static int a[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = n - 1; i > 0; i--) printf(i < n - 1 ? " %d" : "%d", a[i]);
    putchar('\n');
    return 0;
}
