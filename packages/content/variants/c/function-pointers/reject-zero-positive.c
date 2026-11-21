#include <stdio.h>

int is_even(int x) { return x % 2 == 0; }
int is_positive(int x) { return x >= 0; }
int is_big(int x) { return x >= 100; }
int count_if(int v[], int n, int (*test)(int)) {
    int c = 0;
    for (int i = 0; i < n; i++) if (test(v[i])) c++;
    return c;
}

int main(void) {
    int n, v[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    printf("Even: %d\nPositive: %d\nBig: %d\n", count_if(v, n, is_even), count_if(v, n, is_positive), count_if(v, n, is_big));
    return 0;
}
