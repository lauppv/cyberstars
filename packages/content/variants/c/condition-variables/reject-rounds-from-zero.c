#include <stdio.h>
#include <pthread.h>

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t changed = PTHREAD_COND_INITIALIZER;
int turn = 1, operators, rounds;

void *op(void *arg) {
    int me = *(int *)arg;
    for (int round = 1; round <= rounds; round++) {
        pthread_mutex_lock(&lock);
        while (turn != me) pthread_cond_wait(&changed, &lock);
        printf("operator %d, round %d\n", me, round - 1);
        turn = me + 1 > operators ? 1 : me + 1;
        pthread_cond_broadcast(&changed);
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    scanf("%d %d", &operators, &rounds);
    pthread_t t[6]; int ids[6];
    for (int i = 0; i < operators; i++) { ids[i] = i + 1; pthread_create(&t[i], NULL, op, &ids[i]); }
    for (int i = 0; i < operators; i++) pthread_join(t[i], NULL);
    printf("done\n");
    return 0;
}
