```c
#include <stdio.h>
#include <pthread.h>

typedef struct {
    int *numere;
    int inceput;
    int sfarsit;
    int minim_local;
} Interval;

void *cauta_min(void *arg) {
    // Cast-ul din void * la tipul concret e conventia pthread.
    Interval *it = (Interval *)arg;
    int m = it->numere[it->inceput];
    for (int i = it->inceput + 1; i < it->sfarsit; i++) {
        if (it->numere[i] < m) {
            m = it->numere[i];
        }
    }
    // Scriem rezultatul in structura primita; parintele o citeste dupa join.
    it->minim_local = m;
    return NULL;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int numere[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &numere[i]);
    }

    int mij = n / 2;
    Interval a = { numere, 0, mij, 0 };
    Interval b = { numere, mij, n, 0 };

    pthread_t t1, t2;
    pthread_create(&t1, NULL, cauta_min, &a);
    pthread_create(&t2, NULL, cauta_min, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    int minim = a.minim_local < b.minim_local ? a.minim_local : b.minim_local;
    printf("Minim: %d\n", minim);
    return 0;
}
```
