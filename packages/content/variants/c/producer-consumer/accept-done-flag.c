#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

static int ring[5], cap, head, tail, used, finished;
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t room = PTHREAD_COND_INITIALIZER, data = PTHREAD_COND_INITIALIZER;
static int parts[1000], n;
static long sum;

static void *producer(void *a) {
    (void)a;
    for (int i = 0; i < n; i++) {
        pthread_mutex_lock(&mu);
        while (used == cap) pthread_cond_wait(&room, &mu);
        ring[tail] = parts[i];
        tail = (tail + 1) % cap;
        used++;
        pthread_cond_signal(&data);
        pthread_mutex_unlock(&mu);
    }
    pthread_mutex_lock(&mu);
    finished = 1;
    pthread_cond_signal(&data);
    pthread_mutex_unlock(&mu);
    return NULL;
}

static void *consumer(void *a) {
    (void)a;
    for (;;) {
        pthread_mutex_lock(&mu);
        while (used == 0 && !finished) pthread_cond_wait(&data, &mu);
        if (used == 0) { pthread_mutex_unlock(&mu); break; }
        int w = ring[head];
        head = (head + 1) % cap;
        used--;
        pthread_cond_signal(&room);
        pthread_mutex_unlock(&mu);
        printf("packed %d\n", w);
        sum += w;
    }
    return NULL;
}

int main(void) {
    scanf("%d", &cap);
    while (n < 1000 && scanf("%d", &parts[n]) == 1) n++;
    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL);
    pthread_create(&c, NULL, consumer, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    printf("Total: %ld\n", sum);
    return 0;
}
