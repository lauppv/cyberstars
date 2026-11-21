#include <stdio.h>
#include <sched.h>
#include <pthread.h>

static int A, n, src[2000], dst[2000], amt[2000];
static long bal[10];
static pthread_mutex_t m[10];

static void *run(void *p) {
    for (int k = (int)(long)p; k < n; k += 4) {
        for (;;) {
            pthread_mutex_lock(&m[src[k]]);
            if (pthread_mutex_trylock(&m[dst[k]]) == 0) break;
            pthread_mutex_unlock(&m[src[k]]);
            sched_yield();
        }
        bal[src[k]] -= amt[k];
        bal[dst[k]] += amt[k];
        pthread_mutex_unlock(&m[dst[k]]);
        pthread_mutex_unlock(&m[src[k]]);
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
