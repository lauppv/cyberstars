#include <limits.h>
#include <stdio.h>

int main(void) {
    int n;
    static int a[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int best = INT_MAX;
    for (int i = 0; i < n; i++) best = a[i] < best ? a[i] : best;
    printf("%d\n", best);
    return 0;
}
