```c
#include <stdio.h>
#include <string.h>
#include <pthread.h>

int hist[26] = {0};
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

typedef struct {
    char *sir;
    int inceput;
    int sfarsit;
} Interval;

void *acumuleaza(void *arg) {
    Interval *it = (Interval *)arg;
    for (int i = it->inceput; i < it->sfarsit; i++) {
        int idx = it->sir[i] - 'a';
        // Protejam incrementarea: doua fire pot atinge acelasi slot in acelasi moment.
        pthread_mutex_lock(&lock);
        hist[idx]++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    char sir[256];
    scanf("%255s", sir);
    int n = strlen(sir);
    int mij = n / 2;

    Interval a = { sir, 0, mij };
    Interval b = { sir, mij, n };

    pthread_t t1, t2;
    pthread_create(&t1, NULL, acumuleaza, &a);
    pthread_create(&t2, NULL, acumuleaza, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    // Afisam in ordine alfabetica doar literele care apar.
    for (int i = 0; i < 26; i++) {
        if (hist[i] > 0) {
            printf("%c: %d\n", 'a' + i, hist[i]);
        }
    }
    return 0;
}
```
