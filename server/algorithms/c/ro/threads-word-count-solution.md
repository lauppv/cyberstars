```c
#include <stdio.h>
#include <pthread.h>

int total = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *numara(void *arg) {
    char *sir = (char *)arg;
    int local = 0;
    int in_cuvant = 0;

    // Parcurgem caracterele: numaram fiecare tranzitie de la 'nu-cuvant' la 'cuvant'.
    for (int i = 0; sir[i]; i++) {
        if (sir[i] != ' ' && sir[i] != '\n') {
            if (!in_cuvant) {
                local++;
                in_cuvant = 1;
            }
        } else {
            in_cuvant = 0;
        }
    }

    // Adaugam contributia locala la contorul global, protejat de mutex.
    pthread_mutex_lock(&lock);
    total += local;
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main(void) {
    char sir1[256], sir2[256];
    fgets(sir1, sizeof(sir1), stdin);
    fgets(sir2, sizeof(sir2), stdin);

    pthread_t t1, t2;
    pthread_create(&t1, NULL, numara, sir1);
    pthread_create(&t2, NULL, numara, sir2);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Total cuvinte: %d\n", total);
    return 0;
}
```
