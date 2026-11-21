```c
#include <stdio.h>
#include <pthread.h>

struct lucrare {
    char nume[16];
    int limita;
    long rezultat;
};

struct lucrare lucrari[100];
int nr_lucrari = 0;

int coada[5];
int loc;
int intra = 0, iese = 0, numar = 0;
pthread_mutex_t lacat = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t nu_e_plina = PTHREAD_COND_INITIALIZER;
pthread_cond_t nu_e_goala = PTHREAD_COND_INITIALIZER;

void pune(int obiect) {
    pthread_mutex_lock(&lacat);
    while (numar == loc) {
        pthread_cond_wait(&nu_e_plina, &lacat);
    }
    coada[intra] = obiect;
    intra = (intra + 1) % loc;
    numar++;
    pthread_cond_signal(&nu_e_goala);
    pthread_mutex_unlock(&lacat);
}

int ia(void) {
    pthread_mutex_lock(&lacat);
    while (numar == 0) {
        pthread_cond_wait(&nu_e_goala, &lacat);
    }
    int obiect = coada[iese];
    iese = (iese + 1) % loc;
    numar--;
    pthread_cond_signal(&nu_e_plina);
    pthread_mutex_unlock(&lacat);
    return obiect;
}

long numara_prime(int limita) {
    long prime = 0;
    for (int x = 2; x <= limita; x++) {
        int e_prim = 1;
        for (int d = 2; d * d <= x; d++) {
            if (x % d == 0) {
                e_prim = 0;
                break;
            }
        }
        prime = prime + e_prim;
    }
    return prime;
}

void *lucrator(void *arg) {
    (void)arg;
    while (1) {
        int j = ia();
        if (j == -1) {
            break;
        }
        lucrari[j].rezultat = numara_prime(lucrari[j].limita);
    }
    return NULL;
}

int main(void) {
    int lucratori;
    scanf("%d %d", &lucratori, &loc);
    while (nr_lucrari < 100 &&
           scanf("%15s %d", lucrari[nr_lucrari].nume, &lucrari[nr_lucrari].limita) == 2) {
        nr_lucrari++;
    }

    pthread_t fire[4];
    for (int i = 0; i < lucratori; i++) {
        pthread_create(&fire[i], NULL, lucrator, NULL);
    }
    for (int j = 0; j < nr_lucrari; j++) {
        pune(j);
    }
    for (int i = 0; i < lucratori; i++) {
        pune(-1);
    }
    for (int i = 0; i < lucratori; i++) {
        pthread_join(fire[i], NULL);
    }

    long total = 0;
    for (int j = 0; j < nr_lucrari; j++) {
        printf("%s: %ld\n", lucrari[j].nume, lucrari[j].rezultat);
        total = total + lucrari[j].rezultat;
    }
    printf("Lucrari: %d, total: %ld\n", nr_lucrari, total);
    return 0;
}
```
