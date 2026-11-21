Un **semnal** e un mesaj mic pe care kernelul îl livrează unui proces. Nu duce date, doar un număr cu un nume. Am întâlnit deja câteva: un copil oprit de semnalul 6, SIGABRT, sau de 11, SIGSEGV. Încă unele

```text
SIGINT    2   Ctrl + C într-un terminal
SIGKILL   9   oprește-te acum, nu poate fi prins sau ignorat
SIGSEGV  11   acces greșit la memorie
SIGTERM  15   te rog oprește-te (calea politicoasă)
SIGCHLD  17   unul dintre copiii tăi s-a terminat
SIGUSR1  10   liber pentru folosul nostru
SIGUSR2  12   liber pentru folosul nostru
```

Semnalele vin de la kernel, ca SIGSEGV, sau de la alt proces, ca atunci când apăsăm Ctrl + C sau când un program îi spune altuia să se oprească

---

Fiecare semnal are o **acțiune implicită**. Pentru cele mai multe, ea este „termină procesul”. Dar un program poate alege altceva: să ruleze o funcție a lui, numită **handler**, sau să ignore semnalul. Cel mai simplu apel pentru asta e **signal**, din signal.h

```c
#include <stdio.h>
#include <signal.h>

volatile sig_atomic_t sonerii = 0;

void la_usr1(int sig) {
    (void)sig;
    sonerii++;
}

int main(void) {
    signal(SIGUSR1, la_usr1);
    raise(SIGUSR1);
    raise(SIGUSR1);
    printf("sonerii: %d\n", sonerii);

    signal(SIGUSR1, SIG_IGN);
    raise(SIGUSR1);
    printf("sonerii: %d\n", sonerii);
    return 0;
}
```

Ieșire

```text
sonerii: 2
sonerii: 2
```

**raise** trimite un semnal propriului nostru proces. Handler-ul rulează înainte ca raise să se întoarcă, deci numărătoarea e gata pe linia următoare. După `signal(SIGUSR1, SIG_IGN)`, semnalul e pur și simplu aruncat. `SIG_DFL` ar aduce înapoi acțiunea implicită

---

Un handler poate rula oricând, în mijlocul oricărei linii din programul nostru. Așa că trebuie să fie scurt și atent

- Lasă-l doar să pună un semn (flag) sau să numere, iar munca adevărată las-o lui main
- Folosește tipul **volatile sig_atomic_t** pentru tot ce schimbă handler-ul. sig_atomic_t e un număr întreg citit sau scris mereu dintr-un singur pas, iar volatile îi spune compilatorului că se poate schimba singur, deci trebuie citit mereu din nou
- Nu apela printf într-un handler. Dacă semnalul a venit în mijlocul unui printf din main, un al doilea printf i-ar putea strica bufferul

---

Ca să trimitem un semnal altui proces, folosim **kill**, din signal.h. În ciuda numelui, poate trimite orice semnal, nu doar pe cele care omoară

```c
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        pause();
        _exit(0);
    }

    kill(pid, SIGTERM);
    int stare;
    waitpid(pid, &stare, 0);
    if (WIFSIGNALED(stare)) {
        printf("copilul oprit de semnalul %d\n", WTERMSIG(stare));
    }
    return 0;
}
```

Ieșire

```text
copilul oprit de semnalul 15
```

**pause** adoarme un proces până sosește orice semnal. Copilul ar dormi la nesfârșit, dar acțiunea implicită a lui SIGTERM îl termină. Un program care vrea să se oprească politicos ar putea prinde SIGTERM, și-ar salva munca și apoi ar ieși singur

---

## Misiune: Panoul de semnale

Operatorii testează legăturile de semnale ale unui program trimițându-i semnale într-o ordine dată, iar programul numără ce primește

1. Instalează handler-e pentru SIGUSR1 și SIGUSR2 care doar numără, fiecare în contorul lui
2. Citește cuvinte până se termină datele și fă ce spune fiecare
   - `USR1`: trimite-ți SIGUSR1 cu raise
   - `USR2`: trimite-ți SIGUSR2
   - `ignore`: de acum înainte, ignoră SIGUSR1
   - `catch`: de acum înainte, prinde din nou SIGUSR1 cu handler-ul tău
3. Afișează cele două numărători, ca în exemplu
4. Apoi fă un copil care așteaptă cu pause. Trimite-i SIGTERM cu kill, așteaptă-l și afișează numărul semnalului care l-a oprit

Apelează fflush(stdout) înainte de fork. Sunt cel mult 100 de cuvinte

**Exemplu**

Intrare

```text
USR1 USR2 ignore USR1 USR1 catch USR1
```

Ieșire

```text
USR1: 2
USR2: 1
copilul oprit de semnalul 15
```
