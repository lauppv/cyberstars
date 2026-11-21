De fiecare dată când se termină un copil, kernelul îi trimite părintelui **SIGCHLD**. Implicit, părintele îl ignoră. Dar un părinte care are altă treabă de făcut, ca un shell care îți așteaptă următoarea comandă în timp ce o lucrare rulează în fundal, îl poate prinde și își poate strânge copiii exact când se termină, în loc să oprească totul ca să aștepte

---

Handler-ul strânge copiii cu waitpid, folosind două lucruri noi

- `-1` ca PID: orice copil
- **WNOHANG**: nu aștepta. Dacă niciun copil nu s-a terminat încă, întoarce 0 imediat

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t stransi = 0;

void la_copil(int sig) {
    (void)sig;
    int salvat = errno;
    int stare;
    while (waitpid(-1, &stare, WNOHANG) > 0) {
        stransi++;
    }
    errno = salvat;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_copil;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGCHLD, &sa, NULL);

    int n = 3;
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(0);
        }
    }

    // sleep se întoarce mai devreme când vine un semnal, așa că verificăm din nou
    while (stransi < n) {
        sleep(1);
    }
    printf("strans: %d\n", stransi);
    return 0;
}
```

Ieșire

```text
strans: 3
```

De ce o **buclă**? Ține minte că semnalele nu stau la coadă. Dacă trei copii se termină aproape în același moment, părintele poate primi un singur SIGCHLD. Un singur waitpid ar strânge un copil și ar lăsa doi zombi. Bucla tot strânge până nu mai rămâne niciun copil terminat

Și de ce salvăm errno? waitpid îl schimbă, iar handler-ul poate întrerupe main-ul exact între un apel eșuat și momentul în care main citește errno. Punându-l la loc, handler-ul trece neobservat

---

Acum main trebuie să aștepte până sunt strânși toți copiii. O primă idee

```text
while (stransi < n) {
    pause();
}
```

Dar există o gaură. Dacă ultimul SIGCHLD vine chiar după verificarea `stransi < n` și înainte să înceapă pause, pause doarme la nesfârșit: semnalul pe care îl aștepta a venit deja. Se întâmplă rar, și tocmai asta e mai rău: programul se blochează o dată la o mie de rulări

Reparația e **sigsuspend**. Ținem SIGCHLD blocat cât verificăm, iar sigsuspend îl deblochează și adoarme **într-un singur pas**, deci nimic nu se poate strecura între ele

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t stransi = 0;

void la_copil(int sig) {
    (void)sig;
    int salvat = errno;
    int stare;
    while (waitpid(-1, &stare, WNOHANG) > 0) {
        stransi++;
    }
    errno = salvat;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_copil;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGCHLD, &sa, NULL);

    int n = 3;
    sigset_t bloc, vechi;
    sigemptyset(&bloc);
    sigaddset(&bloc, SIGCHLD);
    sigprocmask(SIG_BLOCK, &bloc, &vechi);

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(0);
        }
    }

    while (stransi < n) {
        sigsuspend(&vechi);
    }
    sigprocmask(SIG_SETMASK, &vechi, NULL);
    printf("strans: %d\n", stransi);
    return 0;
}
```

Ieșire

```text
strans: 3
```

sigsuspend(&vechi) doarme cu masca veche, în care SIGCHLD nu e blocat. Când sosește un SIGCHLD, rulează handler-ul, sigsuspend se întoarce, iar SIGCHLD e iar blocat pentru următoarea verificare. Îl blocăm **înainte** să pornim copiii, așa că nici măcar un copil care se termină foarte repede nu poate fi ratat

---

## Misiune: Lotul de noapte

Lotul de noapte pornește deodată multe lucrări scurte și adună codurile lor de ieșire, care sunt rezultatele lucrărilor. Strânge lucrările dintr-un handler pentru SIGCHLD, pe măsură ce se termină

1. Instalează cu sigaction un handler pentru SIGCHLD. Într-o buclă, strânge fiecare copil terminat cu waitpid, -1 și WNOHANG, îl numără și adaugă codul lui de ieșire la un total
2. Blochează SIGCHLD, apoi citește un număr întreg n și n coduri. Pornește n copii. Copilul i iese imediat cu codul i
3. Așteaptă cu sigsuspend până sunt strânși toți cei n copii
4. Afișează câți au fost strânși și totalul codurilor lor, ca în exemplu

n e între 1 și 30, iar fiecare cod e între 0 și 255. Apelează fflush(stdout) înainte de fiecare fork

**Exemplu**

Intrare

```text
4
10 0 255 7
```

Ieșire

```text
Stransi: 4
Total: 272
```
