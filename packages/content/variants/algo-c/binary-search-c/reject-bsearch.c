#include <stdio.h>
#include <stdlib.h>

static int cmp(const void *a, const void *b) {
    return *(const int *)a - *(const int *)b;
}

int main(void) {
    int n, target;
    static int a[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &target);
    int *hit = bsearch(&target, a, n, sizeof(int), cmp);
    printf("%d\n", hit ? (int)(hit - a) : -1);
    return 0;
}
