#include <pthread.h>
#include <stdio.h>
#include <string.h>

static char s[100001];
static int hist[26];

typedef struct {
    int start;
    int stop;
} Range;

static void *accumulate(void *arg) {
    Range *r = arg;
    for (int i = r->start; i < r->stop; i++) hist[s[i] - 'a']++;
    return NULL;
}

int main(void) {
    scanf("%100000s", s);
    int n = (int)strlen(s);
    Range a = {0, n / 2}, b = {n / 2, n};
    pthread_t t1, t2;
    pthread_create(&t1, NULL, accumulate, &a);
    pthread_join(t1, NULL);
    pthread_create(&t2, NULL, accumulate, &b);
    pthread_join(t2, NULL);
    for (int i = 0; i < 26; i++) {
        if (hist[i] > 0) printf("%c: %d\n", 'a' + i, hist[i]);
    }
    return 0;
}
