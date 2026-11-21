```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

int banda[5];
int marime;
int intra = 0, iese = 0, numar = 0;
pthread_mutex_t lacat = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t nu_e_plin = PTHREAD_COND_INITIALIZER;
pthread_cond_t nu_e_gol = PTHREAD_COND_INITIALIZER;

int greutati[1000];
int piese = 0;
long total = 0;

void pune(int obiect) {
    pthread_mutex_lock(&lacat);
    while (numar == marime) {
        pthread_cond_wait(&nu_e_plin, &lacat);
    }
    banda[intra] = obiect;
    intra = (intra + 1) % marime;
    numar++;
    pthread_cond_signal(&nu_e_gol);
    pthread_mutex_unlock(&lacat);
}

int ia(void) {
    pthread_mutex_lock(&lacat);
    while (numar == 0) {
        pthread_cond_wait(&nu_e_gol, &lacat);
    }
    int obiect = banda[iese];
    iese = (iese + 1) % marime;
    numar--;
    pthread_cond_signal(&nu_e_plin);
    pthread_mutex_unlock(&lacat);
    return obiect;
}

void *presa(void *arg) {
    (void)arg;
    for (int i = 0; i < piese; i++) {
        pune(greutati[i]);
    }
    pune(0);
    return NULL;
}

void *ambalator(void *arg) {
    (void)arg;
    while (1) {
        int obiect = ia();
        if (obiect == 0) {
            break;
        }
        printf("ambalat %d\n", obiect);
        total = total + obiect;
    }
    return NULL;
}

int main(void) {
    scanf("%d", &marime);
    while (piese < 1000 && scanf("%d", &greutati[piese]) == 1) {
        piese++;
    }

    pthread_t producator, consumator;
    pthread_create(&producator, NULL, presa, NULL);
    pthread_create(&consumator, NULL, ambalator, NULL);
    pthread_join(producator, NULL);
    pthread_join(consumator, NULL);

    printf("Total: %ld\n", total);
    return 0;
}
```
