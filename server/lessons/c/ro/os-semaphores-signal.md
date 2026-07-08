Cea mai puternică utilizare a semaforului nu e ca mutex, ci ca **semnal** între fire. Trucul: inițializăm semaforul cu **0**. Astfel, `sem_wait` blochează imediat — până când un alt fir face `sem_post`.

Schema e utilă când vrem ca un fir să aștepte un **eveniment** de la altul: un rezultat pregătit, o intrare disponibilă, o comandă terminată. Diferit de mutex, unde ambele fire "concurează" pentru resursă, aici avem o relație clară: unul așteaptă, celălalt semnalează.

```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t gata;
int rezultat;

void *calculeaza(void *arg) {
    // Facem un calcul lung...
    rezultat = 42;
    // Semnalam ca rezultatul e gata.
    sem_post(&gata);
    return NULL;
}

int main(void) {
    sem_init(&gata, 0, 0);   // init cu 0 — sem_wait blocheaza imediat

    pthread_t worker;
    pthread_create(&worker, NULL, calculeaza, NULL);

    // Asteptam semnalul de la worker.
    sem_wait(&gata);
    printf("Rezultat: %d\n", rezultat);

    pthread_join(worker, NULL);
    sem_destroy(&gata);
    return 0;
}
```

Poți zice: "Dar `pthread_join` face același lucru — așteaptă firul." Corect, aici `pthread_join` ar fi fost destul. Semaforul strălucește când vrem să **așteptăm un moment intermediar** din execuția firului (nu terminarea totală), sau când firul rulează într-o buclă infinită și niciodată nu se termină de tot.

---

Când combini două semafoare, poți sincroniza doi actori care fac schimb de mesaje — un pattern numit **rendezvous**. Producătorul pune o valoare într-o variabilă partajată, semnalează `plin`, apoi așteaptă `gol`; consumatorul așteaptă `plin`, citește, apoi semnalează `gol` înapoi. Ambele fire alternează controlul printr-un singur slot.

```text
sem_t plin;   // init 0 — semnalat de producator cand slotul are date
sem_t gol;    // init 1 — semnalat de consumator cand slotul e liber
```

Pattern-ul e fundamentul multor cozi de mesaje și pipeline-uri.

---

## Misiune: Așteaptă rezultatul

Un fir "worker" trebuie să calculeze suma numerelor **1 până la 10** și să o pună într-o variabilă globală. Firul principal așteaptă semnalul, apoi tipărește rezultatul.

1. Declară un semafor `gata` inițializat cu **0**.
2. Firul worker calculează `1 + 2 + ... + 10` și îl scrie în variabila globală `suma`. Apoi face `sem_post(&gata)`.
3. Firul principal face `sem_wait(&gata)`, apoi tipărește `Suma: 55`.
4. La sfârșit, `pthread_join` pe worker și `sem_destroy` pe semafor.

**Exemplu**

```text
Suma: 55
```

Rezultatul e deterministic — firul principal nu poate tipări valoarea până când worker-ul nu a scris-o și nu a semnalat.

Folosește `sem_t`, `sem_init`, `sem_wait`, `sem_post`, `sem_destroy` din **<semaphore.h>**, și `pthread_create`, `pthread_join` din **<pthread.h>**.
