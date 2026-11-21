Uneori un program nu trebuie să aștepte la nesfârșit: un dispozitiv care nu răspunde niciodată, o lucrare care se blochează. Are nevoie de un ceas care sună după o vreme. **alarm**, din unistd.h, pune unul: după numărul dat de secunde, kernelul ne trimite **SIGALRM**

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>

volatile sig_atomic_t a_sunat = 0;

void la_alarma(int sig) {
    (void)sig;
    a_sunat = 1;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_alarma;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    alarm(1);
    while (!a_sunat) {
        pause();
    }
    printf("a trecut o secunda\n");
    return 0;
}
```

Ieșire

```text
a trecut o secunda
```

Fără un handler, acțiunea implicită a lui SIGALRM termină programul. Un proces are o singură alarmă: un nou apel alarm o înlocuiește pe cea veche, iar `alarm(0)` o anulează

---

alarm numără în secunde întregi. Pentru timpi mai scurți există **setitimer**, din sys/time.h. Primește un struct cu secunde și microsecunde. O microsecundă e o milionime de secundă, deci 250 ms înseamnă 250000 de microsecunde

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>

volatile sig_atomic_t rang = 0;

void on_alarm(int sig) {
    (void)sig;
    rang = 1;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_alarm;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    struct itimerval ceas;
    memset(&ceas, 0, sizeof(ceas));
    ceas.it_value.tv_sec = 0;
    ceas.it_value.tv_usec = 250000;
    setitimer(ITIMER_REAL, &ceas, NULL);

    while (!rang) {
        pause();
    }
    printf("a trecut un sfert de secunda\n");
    return 0;
}
```

Ieșire

```text
a trecut un sfert de secunda
```

`it_value` e momentul în care sună. Struct-ul mai are și `it_interval`, ca să sune iar și iar, dar îl lăsăm la 0 pentru o singură sonerie. Ca să anulăm ceasul, apelăm setitimer din nou cu totul pe 0

---

Partea interesantă e ce face un semnal unui apel care **așteaptă**, ca waitpid care așteaptă un copil sau read care așteaptă date. Dacă handler-ul nostru a fost instalat **fără** SA_RESTART, apelul care aștepta renunță: întoarce -1 și pune errno pe **EINTR**, adică „întrerupt”. Exact asta vrem pentru o limită de timp

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

void on_alarm(int sig) {
    (void)sig;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_alarm;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        sleep(5);
        _exit(0);
    }

    alarm(1);
    int stare;
    pid_t gata = waitpid(pid, &stare, 0);
    if (gata == -1 && errno == EINTR) {
        // ceasul a sunat înainte să se termine copilul
        printf("prea incet, il opresc\n");
        kill(pid, SIGKILL);
        waitpid(pid, &stare, 0);
    }
    return 0;
}
```

Ieșire

```text
prea incet, il opresc
```

---

E o mică capcană. Ceasul ar putea suna chiar după ce s-a terminat copilul, înainte să-l anulăm. Așa că hotărâm după ce a întors waitpid, nu după flag. Iar după o depășire de timp, tot omorâm copilul și îl așteptăm, ca să nu rămână zombie

---

## Misiune: Paznicul

Unele lucrări se blochează. Paznicul rulează fiecare comandă cu o limită de timp de 500 de milisecunde și oprește orice comandă care durează mai mult

1. Instalează cu sigaction un handler pentru SIGALRM, **fără** SA_RESTART. Doar pune un flag
2. Citește comenzi, câte una pe linie, până se termină datele. Fiecare e un program și argumentele lui
3. Pentru fiecare comandă, fă un fork și rulează comanda în copil cu execvp. Dacă exec eșuează, copilul iese cu 127
4. În părinte, pornește un ceas de 500 ms cu setitimer și așteaptă copilul cu waitpid
   - dacă waitpid întoarce copilul, anulează ceasul și afișează comanda și `iesire` cu codul ei de ieșire
   - dacă waitpid e întrerupt, trimite-i copilului SIGKILL, așteaptă-l și afișează comanda și `timp depasit`

Apelează fflush(stdout) înainte de fiecare fork. Comenzile au cel mult 100 de caractere și 8 cuvinte. Nu citesc niciodată date de intrare

**Exemplu**

Intrare

```text
seq 2
sleep 5
false
```

Ieșire

```text
1
2
seq 2: iesire 0
sleep 5: timp depasit
false: iesire 1
```

sleep 5 așteaptă 5 secunde și apoi iese. Paznicul nu-l lasă niciodată să ajungă până acolo
