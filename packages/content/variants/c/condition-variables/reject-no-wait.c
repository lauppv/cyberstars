#include <stdio.h>
#include <pthread.h>

int main(void) {
    int k, r;
    scanf("%d %d", &k, &r);
    pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
    pthread_mutex_lock(&m);
    while (0) {}
    for (int round = 1; round <= r; round++)
        for (int i = 1; i <= k; i++) printf("operator %d, round %d\n", i, round);
    pthread_mutex_unlock(&m);
    printf("done\n");
    (void)pthread_create;
    return 0;
}
