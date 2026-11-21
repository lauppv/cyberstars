#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

struct piece { int start, length; int *r; long sum; };
void *add(void *a) { struct piece *p = a; p->sum = 0; for (int i = p->start; i < p->start + p->length; i++) p->sum += p->r[i]; return NULL; }

int main(void) {
    int k, n; scanf("%d %d", &k, &n);
    int *r = malloc(n * sizeof(int)); for (int i = 0; i < n; i++) scanf("%d", &r[i]);
    struct piece p[8]; pthread_t t[8]; int at = 0;
    for (int i = 0; i < k; i++) { p[i].start = at; p[i].length = n / k + (i == k - 1 ? n % k : 0); p[i].r = r; at += p[i].length; pthread_create(&t[i], NULL, add, &p[i]); }
    long tot = 0;
    for (int i = 0; i < k; i++) { pthread_join(t[i], NULL); printf("piece %d: %d readings, sum %ld\n", i + 1, p[i].length, p[i].sum); tot += p[i].sum; }
    printf("total: %ld\n", tot);
    free(r);
    return 0;
}
