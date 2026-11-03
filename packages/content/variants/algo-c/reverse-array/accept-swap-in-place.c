#include <stdio.h>

int main(void) {
    int n;
    static int a[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    putchar('\n');
    return 0;
}
