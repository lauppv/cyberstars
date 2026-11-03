#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

static char s[100001];
static int hist[26];
static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

typedef struct {
    int start;
    int stop;
} Range;

static void *accumulate(void *arg) {
    Range *r = arg;
    for (int i = r->start; i < r->stop; i++) {
        pthread_mutex_lock(&lock);
        hist[s[i] - 'a']++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    scanf("%100000s", s);
    int n = (int)strlen(s);
    Range a = {0, n / 2}, b = {n / 2, n};
    pthread_t t1, t2;
    pthread_create(&t1, NULL, accumulate, &a);
    pthread_create(&t2, NULL, accumulate, &b);
    sleep(1);
    for (int i = 0; i < 26; i++) {
        if (hist[i] > 0) printf("%c: %d\n", 'a' + i, hist[i]);
    }
    return 0;
}
