#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n, target;
    scanf("%d", &n);
    int *a = malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) scanf("%d", a + i);
    scanf("%d", &target);
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = (lo + hi) >> 1;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    printf("%d\n", lo < n && a[lo] == target ? lo : -1);
    free(a);
    return 0;
}
