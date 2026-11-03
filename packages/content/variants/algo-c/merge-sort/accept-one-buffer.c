#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int *scratch;

static void sort(int *a, int n) {
    if (n < 2) return;
    int half = n / 2;
    sort(a, half);
    sort(a + half, n - half);
    int i = 0, j = half, k = 0;
    while (i < half && j < n) scratch[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < half) scratch[k++] = a[i++];
    while (j < n) scratch[k++] = a[j++];
    memcpy(a, scratch, sizeof(int) * n);
}

int main(void) {
    int n;
    scanf("%d", &n);
    int *a = malloc(sizeof(int) * n);
    scratch = malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    sort(a, n);
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    putchar('\n');
    free(a);
    free(scratch);
    return 0;
}
