#include <stdio.h>

int count_over(int v[], int n, int limit) {
    int c = 0;
    for (int i = 0; i < n; i++) if (v[i] > limit) c++;
    return c;
}

int is_rising(int v[], int n) {
    for (int i = 1; i < n; i++) if (v[i] < v[i - 1]) return 0;
    return 1;
}

int main(void) {
    int n, limit, v[100];
    scanf("%d %d", &n, &limit);
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    printf("Over %d: %d\n", limit, count_over(v, n, limit));
    printf("Rising: %s\n", is_rising(v, n) ? "yes" : "no");
    return 0;
}
