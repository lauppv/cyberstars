#include <pthread.h>
#include <stdio.h>

static int total;
static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

static void *count_words(void *arg) {
    const char *s = arg;
    int local = 1;
    for (int i = 0; s[i]; i++) if (s[i] == ' ') local++;
    pthread_mutex_lock(&lock);
    total += local;
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main(void) {
    static char s1[65536], s2[65536];
    fgets(s1, sizeof s1, stdin);
    fgets(s2, sizeof s2, stdin);
    pthread_t t1, t2;
    pthread_create(&t1, NULL, count_words, s1);
    pthread_create(&t2, NULL, count_words, s2);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("Total words: %d\n", total);
    return 0;
}
