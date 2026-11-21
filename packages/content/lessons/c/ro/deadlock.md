Doi operatori au nevoie de aceleași două unități de bandă. Primul ia unitatea A și o așteaptă pe B. În același moment, al doilea ia unitatea B și o așteaptă pe A. Fiecare așteaptă ceva ce ține celălalt, deci amândoi așteaptă la nesfârșit. Asta e un **deadlock** (blocaj reciproc)

La thread-uri, unitățile sunt mutex-uri

```c
#include <stdio.h>
#include <pthread.h>

pthread_mutex_t a = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t b = PTHREAD_MUTEX_INITIALIZER;

void *primul(void *arg) {
    (void)arg;
    pthread_mutex_lock(&a);
    pthread_mutex_lock(&b);
    // treabă
    pthread_mutex_unlock(&b);
    pthread_mutex_unlock(&a);
    return NULL;
}

void *al_doilea(void *arg) {
    (void)arg;
    pthread_mutex_lock(&b);
    pthread_mutex_lock(&a);
    // treabă
    pthread_mutex_unlock(&a);
    pthread_mutex_unlock(&b);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, primul, NULL);
    pthread_create(&t2, NULL, al_doilea, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("ambele thread-uri au terminat\n");
    return 0;
}
```

Ieșire

```text
ambele thread-uri au terminat
```

De cele mai multe ori programul merge, pentru că un thread e puțin mai rapid și ia ambele mutex-uri înainte să pornească celălalt. Dar uneori primul thread ia a, al doilea ia b, iar programul îngheață. Un bug care apare o dată la o mie de rulări e cel mai greu de găsit

---

Un deadlock are nevoie de patru lucruri în același timp

1. **Doar unul o dată**: o resursă poate fi ținută doar de un thread, ca un mutex
2. **Ține și așteaptă**: un thread păstrează ce are în timp ce așteaptă mai mult
3. **Nimeni nu ia înapoi**: nimeni nu poate lua o resursă de la thread-ul care o ține
4. **Un cerc**: thread-ul 1 îl așteaptă pe 2, care îl așteaptă pe 1, sau un cerc mai lung

Dacă scoți oricare dintre ele, un deadlock nu se mai poate întâmpla. Cel mai ușor de scos e cercul

---

Reparația: dă fiecărui mutex un loc fix într-o ordine și **blochează-le mereu în acea ordine**. Dacă fiecare thread care are nevoie de a și b îl blochează întâi pe a, atunci un thread care îl are pe b nu poate niciodată să-l aștepte pe a. Niciun cerc, niciun deadlock

Când mutex-urile sunt într-un array, ordinea e pur și simplu indicele: blochează întâi indicele mai mic

```c
#include <stdio.h>
#include <pthread.h>

pthread_mutex_t lacate[3];
int mutari = 0;

void blocheaza_ambele(int i, int j) {
    if (i < j) {
        pthread_mutex_lock(&lacate[i]);
        pthread_mutex_lock(&lacate[j]);
    } else {
        pthread_mutex_lock(&lacate[j]);
        pthread_mutex_lock(&lacate[i]);
    }
}

void *inainte(void *arg) {
    (void)arg;
    for (int k = 0; k < 100000; k++) {
        blocheaza_ambele(0, 2);
        mutari++;
        pthread_mutex_unlock(&lacate[0]);
        pthread_mutex_unlock(&lacate[2]);
    }
    return NULL;
}

void *inapoi(void *arg) {
    (void)arg;
    for (int k = 0; k < 100000; k++) {
        blocheaza_ambele(2, 0);
        mutari++;
        pthread_mutex_unlock(&lacate[2]);
        pthread_mutex_unlock(&lacate[0]);
    }
    return NULL;
}

int main(void) {
    for (int i = 0; i < 3; i++) {
        pthread_mutex_init(&lacate[i], NULL);
    }
    pthread_t t1, t2;
    pthread_create(&t1, NULL, inainte, NULL);
    pthread_create(&t2, NULL, inapoi, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("mutari: %d\n", mutari);
    return 0;
}
```

Ieșire

```text
mutari: 200000
```

Ordinea de deblocare nu contează: deblocarea nu așteaptă niciodată

---

O altă ieșire: **pthread_mutex_trylock**. Nu așteaptă niciodată. Dacă mutex-ul e liber, îl blochează și întoarce 0. Dacă nu, întoarce imediat o eroare. Un thread care nu poate lua al doilea mutex îl poate da înapoi pe primul și poate încerca din nou mai târziu. Așa dispare „ține și așteaptă”

---

## Misiune: Ghișeul de transferuri

Banca centrului de calcul ține mai multe conturi, fiecare păzit de mutex-ul lui. Transferurile rulează în patru thread-uri în același timp. Un transfer atinge două conturi, deci trebuie să le blocheze pe amândouă, iar ordinea blocării e ce ține banca să nu înghețe

1. Citește a, numărul de conturi, apoi cele a solduri de început. Apoi citește transferuri până se termină datele: `din in suma`, cu conturile numerotate de la 0
2. Dă fiecărui cont propriul mutex
3. Pornește 4 thread-uri. Thread-ul t face transferurile t, t + 4, t + 8 și așa mai departe. Pentru fiecare transfer, blochează ambele conturi în ordine, întâi numărul mai mic, mută suma dintr-unul în celălalt, apoi deblochează. Un sold poate coborî sub zero
4. Așteaptă toate thread-urile, apoi afișează fiecare sold și totalul tuturor soldurilor, ca în exemplu

a e între 2 și 10, iar transferurile sunt între 1 și 2000. din și in sunt mereu diferite

**Exemplu**

Intrare

```text
3
100 50 0
0 1 30
1 2 70
2 0 10
```

Ieșire

```text
contul 0: 80
contul 1: 10
contul 2: 60
total: 150
```

Totalul nu se schimbă niciodată: banii doar se mută între conturi
