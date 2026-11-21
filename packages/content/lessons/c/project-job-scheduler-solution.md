```c
#include <stdio.h>
#include <pthread.h>

struct job {
    char name[16];
    int limit;
    long result;
};

struct job jobs[100];
int job_count = 0;

int queue[5];
int room;
int in = 0, out = 0, count = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t not_full = PTHREAD_COND_INITIALIZER;
pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;

void put(int item) {
    pthread_mutex_lock(&lock);
    while (count == room) {
        pthread_cond_wait(&not_full, &lock);
    }
    queue[in] = item;
    in = (in + 1) % room;
    count++;
    pthread_cond_signal(&not_empty);
    pthread_mutex_unlock(&lock);
}

int take(void) {
    pthread_mutex_lock(&lock);
    while (count == 0) {
        pthread_cond_wait(&not_empty, &lock);
    }
    int item = queue[out];
    out = (out + 1) % room;
    count--;
    pthread_cond_signal(&not_full);
    pthread_mutex_unlock(&lock);
    return item;
}

long count_primes(int limit) {
    long primes = 0;
    for (int x = 2; x <= limit; x++) {
        int prime = 1;
        for (int d = 2; d * d <= x; d++) {
            if (x % d == 0) {
                prime = 0;
                break;
            }
        }
        primes = primes + prime;
    }
    return primes;
}

void *worker(void *arg) {
    (void)arg;
    while (1) {
        int j = take();
        if (j == -1) {
            break;
        }
        jobs[j].result = count_primes(jobs[j].limit);
    }
    return NULL;
}

int main(void) {
    int workers;
    scanf("%d %d", &workers, &room);
    while (job_count < 100 &&
           scanf("%15s %d", jobs[job_count].name, &jobs[job_count].limit) == 2) {
        job_count++;
    }

    pthread_t threads[4];
    for (int i = 0; i < workers; i++) {
        pthread_create(&threads[i], NULL, worker, NULL);
    }
    for (int j = 0; j < job_count; j++) {
        put(j);
    }
    for (int i = 0; i < workers; i++) {
        put(-1);
    }
    for (int i = 0; i < workers; i++) {
        pthread_join(threads[i], NULL);
    }

    long total = 0;
    for (int j = 0; j < job_count; j++) {
        printf("%s: %ld\n", jobs[j].name, jobs[j].result);
        total = total + jobs[j].result;
    }
    printf("Jobs: %d, total: %ld\n", job_count, total);
    return 0;
}
```
