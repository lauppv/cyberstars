#include <stdio.h>
#include <stdlib.h>

static void insertion_sort(int *a, int n) {
    for (int *p = a + 1; p < a + n; p++) {
        int key = *p;
        int *q = p;
        for (; q > a && q[-1] > key; q--) *q = q[-1];
        *q = key;
    }
}

int main(void) {
    int n;
    scanf("%d", &n);
    int *a = malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    insertion_sort(a, n);
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    putchar('\n');
    free(a);
    return 0;
}
