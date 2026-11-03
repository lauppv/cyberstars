#include <pthread.h>
#include <stdio.h>

static long total;
static pthread_mutex_t guard;

static void *count(void *arg) {
    const char *s = arg;
    long mine = 0;
    for (int i = 0; s[i]; i++) {
        int here = s[i] != ' ' && s[i] != '\n';
        int before = i > 0 && s[i - 1] != ' ' && s[i - 1] != '\n';
        if (here && !before) mine++;
    }
    pthread_mutex_lock(&guard);
    total += mine;
    pthread_mutex_unlock(&guard);
    return NULL;
}

int main(void) {
    static char a[65536], b[65536];
    fgets(a, sizeof a, stdin);
    fgets(b, sizeof b, stdin);
    pthread_mutex_init(&guard, NULL);
    pthread_t t1, t2;
    pthread_create(&t1, NULL, count, a);
    pthread_create(&t2, NULL, count, b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("Total words: %ld\n", total);
    return 0;
}
