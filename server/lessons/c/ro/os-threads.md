Un **proces** este un program întreg cu propria sa memorie. Dar uneori vrem să se întâmple mai multe lucruri în același timp **înăuntrul aceluiași program**, partajând aceeași memorie. Asta sunt **thread-urile**

Un thread este ca un **proces ușor**. Mai multe thread-uri din interiorul unui proces partajează același heap, aceleași variabile globale și același cod — dar fiecare are **propria sa stivă** (propriile sale variabile locale)

Gândește-te așa: un **proces** este o bucătărie (spațiu separat, ustensile separate). Un **thread** este un bucătar înăuntrul bucătăriei. Mai mulți bucătari (thread-uri) partajează aceeași bucătărie (procesul), folosind aceleași ingrediente (memoria), dar fiecare urmează propria sa rețetă (stivă)

---

În C, folosim biblioteca **pthread** (POSIX threads)

```c
#include <stdio.h>
#include <pthread.h>

void *spune_salut(void *arg) {
    char *nume = (char *)arg;
    printf("Salut de la thread: %s\n", nume);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, spune_salut, "Thread A");
    pthread_create(&t2, NULL, spune_salut, "Thread B");

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Ambele threaduri au terminat\n");
    return 0;
}
```

**pthread_create** pornește un thread nou care rulează funcția **spune_salut**. Ultimul argument este transmis funcției. **pthread_join** așteaptă ca thread-ul să termine — ca **wait()** pentru procese

Semnătura funcției este specială: primește un **void \*** și returnează un **void \***. Aceasta este convenția pthread — **void \*** este "pointer-ul generic" din C care poate indica spre orice

---

De ce thread-uri în loc de procese? **Viteză**. Crearea unui thread este mult mai rapidă decât fork la un proces. Și thread-urile partajează memoria, deci pot comunica fără pipe-uri. Dar asta vine cu un preț: **memoria partajată este periculoasă**

```c
#include <stdio.h>
#include <pthread.h>

int contor = 0;

void *incrementeaza(void *arg) {
    for (int i = 0; i < 100000; i++) {
        contor++;
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, incrementeaza, NULL);
    pthread_create(&t2, NULL, incrementeaza, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Contor: %d\n", contor);
    return 0;
}
```

Te-ai aștepta la **200000**, dar rulează-l de câteva ori și ai putea obține numere diferite de fiecare dată! Aceasta este o **race condition** — ambele thread-uri modifică **contor** simultan, iar operațiile lor se pot interfera

---

Soluția: un **mutex** (mutual exclusion lock). Doar un singur thread poate ține lock-ul la un moment dat

```c
#include <stdio.h>
#include <pthread.h>

int contor = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *incrementeaza(void *arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&lock);
        contor++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, incrementeaza, NULL);
    pthread_create(&t2, NULL, incrementeaza, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("Contor: %d\n", contor);
    return 0;
}
```

Acum **contor** va fi întotdeauna exact 200000. Mutex-ul asigură că doar un singur thread atinge contor la un moment dat. Dar există un compromis: lock/unlock este mai lent. Arta multithreading-ului este să minimizezi timpul cât ții lock-uri

---

Când să folosești **thread-uri** vs **procese**:

- **Thread-uri**: e nevoie de memorie partajată, ușoare, același program care face muncă paralelă (server web care procesează cereri, joc video care actualizează fizica și randarea)
- **Procese**: e nevoie de izolare, siguranță (un crash într-un proces nu-l omoară pe celălalt), rularea unor programe diferite

---

## Misiune: Calibrarea Propulsoarelor Gemene

Propulsoarele gemene ale stației trebuie să tragă impulsuri de test simultan. Fiecare propulsor rulează pe propriul thread, repetând semnalul său pentru a confirma alinierea. Odată ce ambele termină, puntea înregistrează calibrarea ca finalizată.

1. Creează **două thread-uri**, transmițând **"Ping"** primului și **"Pong"** celui de-al doilea
2. Fiecare thread afișează șirul său **de 3 ori**
3. Thread-ul principal așteaptă ca ambele să termine, apoi afișează **"Game over"**

**Output**

```text
Ping
Ping
Ping
Pong
Pong
Pong
Game over
```

Ordinea liniilor Ping și Pong poate varia, dar **"Game over"** trebuie să fie întotdeauna ultimul
