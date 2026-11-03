#include <limits.h>
#include <pthread.h>
#include <stdio.h>

static int values[20000];

struct job {
    int from, to;
    int *out;
};

static void *smallest(void *arg) {
    struct job *j = arg;
    int best = INT_MAX;
    for (int i = j->from; i < j->to; i++) if (values[i] < best) best = values[i];
    *j->out = best;
    return NULL;
}

int main(void) {
    int n, results[2];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    struct job jobs[2] = {{0, n / 2, &results[0]}, {n / 2, n, &results[1]}};
    pthread_t t[2];
    for (int k = 0; k < 2; k++) pthread_create(&t[k], NULL, smallest, &jobs[k]);
    for (int k = 0; k < 2; k++) pthread_join(t[k], NULL);
    printf("Min: %d\n", results[0] < results[1] ? results[0] : results[1]);
    return 0;
}
