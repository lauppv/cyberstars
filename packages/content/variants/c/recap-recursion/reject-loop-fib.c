#include <stdio.h>

int counter(int step) {
    static int total = 0;
    total += step;
    return total;
}

int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) { int t = a + b; a = b; b = t; }
    return a;
}

int calls(int n) {
    if (n < 2) return 1;
    return 1 + calls(n - 1) + calls(n - 2);
}

int main(void) {
    int k, n;
    scanf("%d", &k);
    for (int i = 0; i < k; i++) {
        scanf("%d", &n);
        counter(calls(n));
        printf("fib(%d) = %d, calls: %d\n", n, fib(n), calls(n));
    }
    return 0;
}
