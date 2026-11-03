#include <stdio.h>

int main(void) {
    int n, target;
    static int a[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &target);
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    printf("%d\n", lo);
    return 0;
}
