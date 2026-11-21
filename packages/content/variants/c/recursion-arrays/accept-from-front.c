#include <stdio.h>

int count_over(int v[], int n, int limit) {
    if (n <= 0) return 0;
    return (v[0] > limit) + count_over(v + 1, n - 1, limit);
}

int is_rising(int v[], int n) {
    if (n < 2) return 1;
    return v[0] <= v[1] && is_rising(v + 1, n - 1);
}

int main(void) {
    int n, limit, v[100];
    scanf("%d%d", &n, &limit);
    for (int i = 0; i < n; i++) scanf("%d", v + i);
    printf("Over %d: %d\n", limit, count_over(v, n, limit));
    printf("Rising: %s\n", is_rising(v, n) ? "yes" : "no");
    return 0;
}
