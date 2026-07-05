```c
#include <stdio.h>
#include <pthread.h>

int total = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *count_words(void *arg) {
    char *s = (char *)arg;
    int local = 0;
    int in_word = 0;

    // Walk the characters: count every transition from 'non-word' to 'word'.
    for (int i = 0; s[i]; i++) {
        if (s[i] != ' ' && s[i] != '\n') {
            if (!in_word) {
                local++;
                in_word = 1;
            }
        } else {
            in_word = 0;
        }
    }

    // Add the local contribution to the shared counter, protected by the mutex.
    pthread_mutex_lock(&lock);
    total += local;
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main(void) {
    char s1[256], s2[256];
    fgets(s1, sizeof(s1), stdin);
    fgets(s2, sizeof(s2), stdin);

    pthread_t t1, t2;
    pthread_create(&t1, NULL, count_words, s1);
    pthread_create(&t2, NULL, count_words, s2);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Total words: %d\n", total);
    return 0;
}
```
