Un mutex împiedică două thread-uri să schimbe același lucru deodată. Dar de multe ori un thread trebuie să **aștepte până devine ceva adevărat**: până apare treabă într-o coadă, până îi vine rândul, până e gata un rezultat. Să verifice iar și iar într-o buclă ar arde procesorul degeaba. O **variabilă de condiție** (condition variable) lasă thread-ul să doarmă până când un alt thread îi spune „s-a schimbat ceva, uită-te din nou”

---

O variabilă de condiție lucrează mereu împreună cu un mutex și cu o valoare comună pe care o verificăm

```c
#include <stdio.h>
#include <pthread.h>

pthread_mutex_t lacat = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t schimbat = PTHREAD_COND_INITIALIZER;
int gata = 0;

void *lucrator(void *arg) {
    (void)arg;
    pthread_mutex_lock(&lacat);
    gata = 1;
    pthread_cond_signal(&schimbat);
    pthread_mutex_unlock(&lacat);
    return NULL;
}

int main(void) {
    pthread_t t;
    pthread_create(&t, NULL, lucrator, NULL);

    pthread_mutex_lock(&lacat);
    while (!gata) {
        pthread_cond_wait(&schimbat, &lacat);
    }
    pthread_mutex_unlock(&lacat);

    printf("lucratorul e gata\n");
    pthread_join(t, NULL);
    return 0;
}
```

Ieșire

```text
lucratorul e gata
```

---

**pthread_cond_wait(&cond, &lacat)** face trei lucruri dintr-un singur pas: deblochează mutex-ul, adoarme thread-ul, iar când thread-ul e trezit, blochează din nou mutex-ul înainte să se întoarcă. De aceea trebuie să ținem mutex-ul când o apelăm. Tot asta o face sigură: niciun semnal nu se poate strecura între verificarea noastră și somnul nostru

**pthread_cond_signal** trezește un thread care așteaptă. **pthread_cond_broadcast** le trezește pe toate

---

Observă **while**, nu if. Un thread se poate trezi chiar și când valoarea nu e cea pe care o așteaptă: un alt thread poate să fi fost mai rapid și a schimbat-o din nou, sau sistemul îl poate trezi fără niciun motiv, o „trezire falsă” (spurious wakeup). Așa că după fiecare trezire verifică din nou. Regula e simplă: așteaptă mereu într-o buclă while care verifică condiția adevărată

---

Când mai multe thread-uri așteaptă lucruri diferite pe aceeași variabilă de condiție, folosește broadcast. signal ar putea trezi thread-ul greșit, care se culcă la loc, iar cel potrivit nu află nimic

---

## Misiune: Pe rând

Teleimprimanta poate fi folosită de un singur operator o dată, iar ei trebuie să vină pe rând, într-o ordine fixă: operatorul 1, apoi 2, apoi 3 și înapoi la 1. Fiecare operator e un thread

1. Citește k, numărul de operatori, și r, numărul de ture
2. Ține o valoare comună, rand, care spune al cui e rândul. Pornește k thread-uri. Thread-ul i, numărând de la 1, face asta de r ori: așteaptă până când rand e i, își afișează linia, apoi dă rândul operatorului următor și îi trezește pe ceilalți
3. Folosește un mutex și o variabilă de condiție. Așteaptă într-o buclă while
4. main așteaptă toate thread-urile, apoi afișează `gata`

k e între 2 și 6, iar r între 1 și 20

**Exemplu**

Intrare

```text
3 2
```

Ieșire

```text
operatorul 1, tura 1
operatorul 2, tura 1
operatorul 3, tura 1
operatorul 1, tura 2
operatorul 2, tura 2
operatorul 3, tura 2
gata
```
