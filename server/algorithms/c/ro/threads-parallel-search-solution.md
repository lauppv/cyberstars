```c
#include <stdio.h>
#include <pthread.h>

int numere[100];
int tinta;
int index_gasit = -1;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

typedef struct {
    int inceput;
    int sfarsit;
} Interval;

void *cauta(void *arg) {
    Interval *it = (Interval *)arg;
    for (int i = it->inceput; i < it->sfarsit; i++) {
        if (numere[i] == tinta) {
            // Actualizam index_gasit doar daca noul index e mai mic (sau primul).
            pthread_mutex_lock(&lock);
            if (index_gasit == -1 || i < index_gasit) {
                index_gasit = i;
            }
            pthread_mutex_unlock(&lock);
        }
    }
    return NULL;
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &numere[i]);
    }
    scanf("%d", &tinta);

    int mij = n / 2;
    Interval a = { 0, mij };
    Interval b = { mij, n };

    pthread_t t1, t2;
    pthread_create(&t1, NULL, cauta, &a);
    pthread_create(&t2, NULL, cauta, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    if (index_gasit >= 0) {
        printf("Gasit la indexul %d\n", index_gasit);
    } else {
        printf("Nu apare\n");
    }
    return 0;
}
```
