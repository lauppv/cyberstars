#include <stdio.h>
#include <pthread.h>

static int A, n, src[2000], dst[2000], amt[2000];
static long bal[10];
static pthread_mutex_t m[10];

static void *run(void *p) {
    (void)p;
    for (int k = 0; k < n; k++) {
        int lo = src[k] < dst[k] ? src[k] : dst[k], hi = src[k] < dst[k] ? dst[k] : src[k];
        pthread_mutex_lock(&m[lo]); pthread_mutex_lock(&m[hi]);
        bal[src[k]] -= amt[k]; bal[dst[k]] += amt[k];
        pthread_mutex_unlock(&m[hi]); pthread_mutex_unlock(&m[lo]);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &A);
    for (int i = 0; i < A; i++) { scanf("%ld", &bal[i]); pthread_mutex_init(&m[i], NULL); }
    while (n < 2000 && scanf("%d%d%d", &src[n], &dst[n], &amt[n]) == 3) n++;
    pthread_t t[4];
    for (long i = 0; i < 4; i++) pthread_create(&t[i], NULL, run, (void *)i);
    for (int i = 0; i < 4; i++) pthread_join(t[i], NULL);
    long tot = 0;
    for (int i = 0; i < A; i++) { printf("account %d: %ld\n", i, bal[i]); tot += bal[i]; }
    printf("total: %ld\n", tot);
    return 0;
}
