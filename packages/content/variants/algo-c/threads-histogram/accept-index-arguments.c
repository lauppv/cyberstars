#include <pthread.h>
#include <stdio.h>
#include <string.h>

static char text[100001];
static int counts[26];
static pthread_mutex_t guard;

struct half {
    int from;
    int to;
};

static void *count_letters(void *arg) {
    struct half *h = arg;
    for (int i = h->from; i < h->to; i++) {
        pthread_mutex_lock(&guard);
        counts[text[i] - 'a'] += 1;
        pthread_mutex_unlock(&guard);
    }
    return NULL;
}

int main(void) {
    scanf("%100000s", text);
    int len = (int)strlen(text);
    struct half halves[2] = {{0, len / 2}, {len / 2, len}};
    pthread_t workers[2];
    pthread_mutex_init(&guard, NULL);
    for (int k = 0; k < 2; k++) pthread_create(&workers[k], NULL, count_letters, &halves[k]);
    for (int k = 0; k < 2; k++) pthread_join(workers[k], NULL);
    pthread_mutex_destroy(&guard);
    for (char c = 'a'; c <= 'z'; c++) {
        if (counts[c - 'a']) printf("%c: %d\n", c, counts[c - 'a']);
    }
    return 0;
}
