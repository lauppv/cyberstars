#include <stdio.h>
#include <pthread.h>

static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t cv[7];
static int turn = 1, k, r;

static void *op(void *p) {
    int me = (int)(long)p;
    for (int round = 1; round <= r; round++) {
        pthread_mutex_lock(&m);
        while (turn != me) pthread_cond_wait(&cv[me], &m);
        printf("operator %d, round %d\n", me, round);
        turn = me == k ? 1 : me + 1;
        pthread_cond_signal(&cv[turn]);
        pthread_mutex_unlock(&m);
    }
    return NULL;
}

int main(void) {
    scanf("%d %d", &k, &r);
    for (int i = 0; i <= k; i++) pthread_cond_init(&cv[i], NULL);
    pthread_t t[7];
    for (long i = 1; i <= k; i++) pthread_create(&t[i], NULL, op, (void *)i);
    for (int i = 1; i <= k; i++) pthread_join(t[i], NULL);
    puts("done");
    return 0;
}
