```c
#include <stdio.h>
#include <string.h>
#include <pthread.h>

int hist[26] = {0};
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

typedef struct {
    char *s;
    int start;
    int stop;
} Range;

void *accumulate(void *arg) {
    Range *r = (Range *)arg;
    for (int i = r->start; i < r->stop; i++) {
        int idx = r->s[i] - 'a';
        // Guard the increment: both threads may touch the same slot at once.
        pthread_mutex_lock(&lock);
        hist[idx]++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    char s[256];
    scanf("%255s", s);
    int n = strlen(s);
    int mid = n / 2;

    Range a = { s, 0, mid };
    Range b = { s, mid, n };

    pthread_t t1, t2;
    pthread_create(&t1, NULL, accumulate, &a);
    pthread_create(&t2, NULL, accumulate, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    // Print only the letters that appeared, in alphabetical order.
    for (int i = 0; i < 26; i++) {
        if (hist[i] > 0) {
            printf("%c: %d\n", 'a' + i, hist[i]);
        }
    }
    return 0;
}
```
