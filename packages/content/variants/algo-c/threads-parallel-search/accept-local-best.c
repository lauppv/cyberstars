#include <pthread.h>
#include <stdio.h>

static int values[20000], wanted, best = -1;
static pthread_mutex_t guard = PTHREAD_MUTEX_INITIALIZER;

struct half {
    int from, to;
};

static void *look(void *arg) {
    struct half *h = arg;
    for (int i = h->from; i < h->to; i++) {
        if (values[i] != wanted) continue;
        pthread_mutex_lock(&guard);
        if (best < 0 || i < best) best = i;
        pthread_mutex_unlock(&guard);
        break;
    }
    return NULL;
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    scanf("%d", &wanted);
    struct half parts[2] = {{0, n / 2}, {n / 2, n}};
    pthread_t t[2];
    for (int k = 0; k < 2; k++) pthread_create(&t[k], NULL, look, &parts[k]);
    for (int k = 0; k < 2; k++) pthread_join(t[k], NULL);
    if (best < 0) puts("Not found");
    else printf("Found at index %d\n", best);
    return 0;
}
