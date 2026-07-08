Semafoarele extind ideea de mutex. Un **semafor** este un contor atomic cu două operații:

- **sem_wait(&s)** — decrementează contorul. Dacă e 0, firul **așteaptă** până când altcineva incrementează.
- **sem_post(&s)** — incrementează contorul (și trezește un fir blocat, dacă există).

În C, POSIX-ul ne dă biblioteca **<semaphore.h>**. Semaforul se declară cu tipul `sem_t` și se inițializează cu `sem_init(&s, 0, valoare_initiala)`. Al doilea argument e `0` când semaforul e partajat între fire din același proces (cazul nostru); `1` ar însemna partajat între procese diferite.

---

Când inițializăm semaforul cu **1**, se comportă ca un mutex: un fir intră (contorul devine 0), iar celelalte așteaptă până când el iese și incrementează la loc.

```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t sem;
int contor = 0;

void *incrementeaza(void *arg) {
    for (int i = 0; i < 100000; i++) {
        sem_wait(&sem);
        contor++;
        sem_post(&sem);
    }
    return NULL;
}

int main(void) {
    sem_init(&sem, 0, 1);

    pthread_t t1, t2;
    pthread_create(&t1, NULL, incrementeaza, NULL);
    pthread_create(&t2, NULL, incrementeaza, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Contor: %d\n", contor);
    sem_destroy(&sem);
    return 0;
}
```

Rezultatul e mereu **200000**. Codul e echivalent cu versiunea din lecția anterioară cu mutex — schimbă doar mecanismul. **De ce ai folosi semaforul în loc de mutex?** Pentru că semaforul poate avea contorul > 1, și asta îl face mult mai flexibil.

---

Un **semafor cu contor** (inițializat cu N > 1) modelează un număr de **resurse partajate**. Imaginează-ți centrul de calcul cu **5 imprimante**: cinci lucrări pot rula deodată, iar a șasea așteaptă până se eliberează una.

```text
sem_t imprimante;
sem_init(&imprimante, 0, 5);

// in fiecare thread:
sem_wait(&imprimante);   // rezervam o imprimanta (contor--)
// ... rulam lucrarea
sem_post(&imprimante);   // eliberam imprimanta (contor++)
```

Când cinci fire au făcut `sem_wait`, contorul e 0. Al șaselea fir se **blochează** la `sem_wait` până când una dintre lucrări termină și face `sem_post`.

Cu un mutex nu am putea face asta — mutex-ul e mereu binar (deținut sau liber). Semaforul cu contor **limitează câți intră simultan**, nu doar unul singur.

---

Nu uita `sem_destroy(&sem)` la sfârșit — eliberează resursele interne. Iar `sem_init` cu al treilea argument e valoarea de **plecare** a contorului: 0, 1 sau N.

---

## Misiune: Coada de la imprimante

Centrul de calcul are **2 imprimante** disponibile. Patru operatori trimit lucrări simultan, dar la orice moment cel mult 2 pot fi în lucru; ceilalți așteaptă politicos.

1. Creează un semafor inițializat cu **2**.
2. Pornește **4 fire**, fiecare cu ID-ul lui (1, 2, 3, 4), transmis ca argument.
3. Fiecare fir:
   - Așteaptă semaforul (`sem_wait`).
   - Tipărește `Firul K printeaza`.
   - Tipărește `Firul K termina`.
   - Eliberează semaforul (`sem_post`).
4. Firul principal așteaptă cele 4 fire cu `pthread_join`, apoi tipărește `Toate lucrarile s-au terminat`.

**Exemplu**

Ordinea liniilor `printeaza`/`termina` poate varia — importantă e regula: la orice moment, cel mult 2 fire sunt între `printeaza` și `termina`.

```text
Firul 1 printeaza
Firul 2 printeaza
Firul 1 termina
Firul 3 printeaza
Firul 2 termina
Firul 4 printeaza
Firul 3 termina
Firul 4 termina
Toate lucrarile s-au terminat
```

Ultimul mesaj apare mereu la sfârșit, pentru că firul principal așteaptă cu `pthread_join`.

Folosește `sem_t`, `sem_init`, `sem_wait`, `sem_post`, `sem_destroy` din **<semaphore.h>**, plus `pthread_create` și `pthread_join` din **<pthread.h>**.
