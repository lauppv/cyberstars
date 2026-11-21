#include <stdio.h>

int count_over(int v[], int n, int limit) {
    if (n == 0) return 0;
    return (v[n - 1] > limit ? 1 : 0) + count_over(v, n - 1, limit);
}

int is_rising(int v[], int n) {
    if (n <= 1) return 1;
    if (v[n - 1] <= v[n - 2]) return 0;
    return is_rising(v, n - 1);
}

int main(void) {
    int n, limit, v[100];
    scanf("%d %d", &n, &limit);
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    printf("Over %d: %d\n", limit, count_over(v, n, limit));
    printf("Rising: %s\n", is_rising(v, n) ? "yes" : "no");
    return 0;
}
