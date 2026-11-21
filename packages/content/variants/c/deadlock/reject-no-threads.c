#include <stdio.h>
#include <pthread.h>

int main(void) {
    int A, n = 0, a, b, c;
    long bal[10];
    scanf("%d", &A);
    for (int i = 0; i < A; i++) scanf("%ld", &bal[i]);
    while (n < 2000 && scanf("%d %d %d", &a, &b, &c) == 3) { bal[a] -= c; bal[b] += c; n++; }
    long tot = 0;
    for (int i = 0; i < A; i++) { printf("account %d: %ld\n", i, bal[i]); tot += bal[i]; }
    printf("total: %ld\n", tot);
    return 0;
}
