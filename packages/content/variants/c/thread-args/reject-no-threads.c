#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

struct piece { int start, length; long sum; };

int main(void) {
    int k, n; scanf("%d %d", &k, &n);
    int *r = malloc(n * sizeof(int)); for (int i = 0; i < n; i++) scanf("%d", &r[i]);
    struct piece p[8]; int at = 0; long tot = 0;
    for (int i = 0; i < k; i++) {
        p[i].start = at; p[i].length = n / k + (i < n % k); at += p[i].length; p[i].sum = 0;
        for (int j = p[i].start; j < p[i].start + p[i].length; j++) p[i].sum += r[j];
        printf("piece %d: %d readings, sum %ld\n", i + 1, p[i].length, p[i].sum); tot += p[i].sum;
    }
    printf("total: %ld\n", tot);
    free(r);
    return 0;
}
