#include <stdio.h>

int is_even(int x) { return x % 2 == 0; }
int is_positive(int x) { return x > 0; }
int is_big(int x) { return x > 100; }
int count_if(int v[], int n, int which) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (which == 0 && is_even(v[i])) c++;
        if (which == 1 && is_positive(v[i])) c++;
        if (which == 2 && is_big(v[i])) c++;
    }
    return c;
}

int main(void) {
    int n, v[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    printf("Even: %d\nPositive: %d\nBig: %d\n", count_if(v, n, 0), count_if(v, n, 1), count_if(v, n, 2));
    return 0;
}
