#include <stdio.h>

typedef int (*Test)(int);

int is_even(int x) { return !(x & 1); }
int is_positive(int x) { return x > 0 ? 1 : 0; }
int is_big(int x) { return x > 100; }

int count_if(int v[], int n, Test test) {
    int c = 0;
    while (n-- > 0) c += test(v[n]) != 0;
    return c;
}

int main(void) {
    int n, v[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    const char *names[] = { "Even", "Positive", "Big" };
    Test tests[] = { is_even, is_positive, is_big };
    for (int k = 0; k < 3; k++) printf("%s: %d\n", names[k], count_if(v, n, tests[k]));
    return 0;
}
