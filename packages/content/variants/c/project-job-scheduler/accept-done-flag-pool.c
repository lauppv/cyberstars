#include <stdio.h>
#include <pthread.h>

typedef struct { char name[16]; int limit; long found; } Job;
static Job job[100];
static int njobs, cap, ring[5], head, tail, size, closed;
static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t can_put = PTHREAD_COND_INITIALIZER, can_take = PTHREAD_COND_INITIALIZER;

static long primes_upto(int lim) {
    long c = 0;
    for (int x = 2; x <= lim; x++) {
        int ok = 1;
        for (int d = 2; d * d <= x && ok; d++) ok = x % d != 0;
        c += ok;
    }
    return c;
}

static void *work(void *unused) {
    (void)unused;
    for (;;) {
        pthread_mutex_lock(&m);
        while (size == 0 && !closed) pthread_cond_wait(&can_take, &m);
        if (size == 0) { pthread_mutex_unlock(&m); return NULL; }
        int j = ring[head];
        head = (head + 1) % cap;
        size--;
        pthread_cond_signal(&can_put);
        pthread_mutex_unlock(&m);
        job[j].found = primes_upto(job[j].limit);
    }
}

int main(void) {
    int w;
    scanf("%d %d", &w, &cap);
    while (njobs < 100 && scanf("%15s %d", job[njobs].name, &job[njobs].limit) == 2) njobs++;
    pthread_t t[4];
    for (int i = 0; i < w; i++) pthread_create(&t[i], NULL, work, NULL);
    for (int j = 0; j < njobs; j++) {
        pthread_mutex_lock(&m);
        while (size == cap) pthread_cond_wait(&can_put, &m);
        ring[tail] = j;
        tail = (tail + 1) % cap;
        size++;
        pthread_cond_signal(&can_take);
        pthread_mutex_unlock(&m);
    }
    pthread_mutex_lock(&m);
    closed = 1;
    pthread_cond_broadcast(&can_take);
    pthread_mutex_unlock(&m);
    for (int i = 0; i < w; i++) pthread_join(t[i], NULL);
    long total = 0;
    for (int j = 0; j < njobs; j++) { printf("%s: %ld\n", job[j].name, job[j].found); total += job[j].found; }
    printf("Jobs: %d, total: %ld\n", njobs, total);
    return 0;
}
