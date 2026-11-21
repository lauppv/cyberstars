```c
#include <stdio.h>
#include <pthread.h>

struct transfer {
    int from;
    int to;
    int amount;
};

int accounts;
long balance[10];
pthread_mutex_t locks[10];
struct transfer transfers[2000];
int count = 0;

void lock_both(int i, int j) {
    if (i < j) {
        pthread_mutex_lock(&locks[i]);
        pthread_mutex_lock(&locks[j]);
    } else {
        pthread_mutex_lock(&locks[j]);
        pthread_mutex_lock(&locks[i]);
    }
}

void *desk(void *arg) {
    int t = *(int *)arg;
    for (int k = t; k < count; k = k + 4) {
        struct transfer *tr = &transfers[k];
        lock_both(tr->from, tr->to);
        balance[tr->from] = balance[tr->from] - tr->amount;
        balance[tr->to] = balance[tr->to] + tr->amount;
        pthread_mutex_unlock(&locks[tr->from]);
        pthread_mutex_unlock(&locks[tr->to]);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &accounts);
    for (int i = 0; i < accounts; i++) {
        scanf("%ld", &balance[i]);
        pthread_mutex_init(&locks[i], NULL);
    }
    while (count < 2000 && scanf("%d %d %d", &transfers[count].from,
                                 &transfers[count].to, &transfers[count].amount) == 3) {
        count++;
    }

    pthread_t threads[4];
    int ids[4];
    for (int t = 0; t < 4; t++) {
        ids[t] = t;
        pthread_create(&threads[t], NULL, desk, &ids[t]);
    }
    for (int t = 0; t < 4; t++) {
        pthread_join(threads[t], NULL);
    }

    long total = 0;
    for (int i = 0; i < accounts; i++) {
        printf("account %d: %ld\n", i, balance[i]);
        total = total + balance[i];
    }
    printf("total: %ld\n", total);
    return 0;
}
```
