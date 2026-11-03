#include <stdio.h>

static int values[20000];

static int find(int lo, int hi, int target) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (values[mid] == target) return mid;
    return values[mid] < target ? find(mid + 1, hi, target) : find(lo, mid - 1, target);
}

int main(void) {
    int n, target;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    scanf("%d", &target);
    printf("%d\n", find(0, n - 1, target));
    return 0;
}
