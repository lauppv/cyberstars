#include <stdio.h>

int main(void) {
    int n;
    static int a[30000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = 1; i < n; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] - key > 0) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    putchar('\n');
    return 0;
}
