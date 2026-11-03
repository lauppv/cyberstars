#include <stdio.h>
#include <string.h>

static int tmp[20000];

static void sort(int *a, int n) {
    if (n < 2) return;
    int half = n / 2;
    sort(a, half);
    sort(a + half, n - half);
    int i = 0, j = half, k = 0;
    while (i < half && j < n) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < half) tmp[k++] = a[i++];
    memcpy(a, tmp, sizeof(int) * k);
}

int main(void) {
    int n;
    static int a[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    sort(a, n);
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    putchar('\n');
    return 0;
}
