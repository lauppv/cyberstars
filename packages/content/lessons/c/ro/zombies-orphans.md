Când un proces copil se termină, nu dispare pe loc. Kernelul îi aruncă memoria și codul, dar păstrează o mică intrare despre el în tabelul de procese: PID-ul și codul lui de ieșire. Le păstrează pentru părinte, care s-ar putea să vrea încă să le citească cu wait

Un proces care s-a terminat, dar pe care părintele nu l-a strâns încă, se numește **zombie**. Mort, dar încă pe listă

---

Pe Linux, kernelul arată fiecare proces ca un folder în **/proc**. Fișierul /proc/PID/stat începe cu PID-ul, numele programului între paranteze și o literă pentru stare: R pentru rulează, S pentru doarme, Z pentru zombie

Ca să construim acea cale, avem nevoie de PID într-un șir. **snprintf** face asta: merge ca printf, dar scrie într-un array de caractere și niciodată mai mult decât mărimea pe care i-o dăm

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = 1;
    char cale[64];
    snprintf(cale, sizeof(cale), "/proc/%d/stat", pid);
    printf("%s\n", cale);
    return 0;
}
```

Ieșire

```text
/proc/1/stat
```

---

Ca să vedem un zombie, așteptăm să se termine copilul **fără** să-l strângem. **waitid** poate face asta cu flag-ul WNOWAIT: așteaptă, ne spune cum s-a terminat copilul și îl lasă în tabel

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

char starea(pid_t pid) {
    char cale[64];
    snprintf(cale, sizeof(cale), "/proc/%d/stat", pid);
    FILE *f = fopen(cale, "r");
    if (f == NULL) {
        return '-';
    }
    char stare = '?';
    fscanf(f, "%*d %*s %c", &stare);
    fclose(f);
    return stare;
}

int main(void) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        _exit(3);
    }

    siginfo_t info;
    waitid(P_PID, pid, &info, WEXITED | WNOWAIT);
    printf("dupa ce s-a terminat: %c\n", starea(pid));

    int cod;
    waitpid(pid, &cod, 0);
    printf("dupa waitpid: %c\n", starea(pid));
    return 0;
}
```

Ieșire

```text
dupa ce s-a terminat: Z
dupa waitpid: -
```

În fscanf, `%*d` și `%*s` citesc o valoare și o aruncă, deci sărim peste PID și nume și păstrăm doar litera stării. După waitpid, intrarea dispare, folderul dispare, iar fopen eșuează

---

Un singur zombie nu costă aproape nimic. Dar un program care rulează mult timp, pornește copii și nu-i așteaptă niciodată umple tabelul de procese cu zombi, iar într-o zi fork eșuează pentru că nu mai e loc. De aceea fiecare fork are nevoie de un wait undeva

---

Invers: ce se întâmplă dacă **părintele** se termină primul? Copiii lui devin **orfani**. Continuă să ruleze, iar kernelul le dă un părinte nou: procesul numărul 1, primul proces din sistem sau din container. Procesul 1 își așteaptă fiecare copil primit, deci orfanii nu rămân zombi mult timp

```text
pid_t pid = fork();
if (pid == 0) {
    sleep(1);
    printf("parintele meu e acum %d\n", getppid());
    fflush(stdout);
    _exit(0);
}
return 0;
```

Părintele se termină imediat. După o secundă, orfanul afișează că părintele lui e 1

---

## Misiune: Numărătoarea fantomelor

Operatorul de noapte spune că tabelul de procese e plin de fantome. Arată-i cum apar și cum dispar zombii

1. Citește un număr întreg n, de la 1 la 5
2. Pornește n copii, unul după altul. Copilul cu numărul i, numărând de la 1, iese imediat cu codul i × 10
3. Pentru fiecare copil, în ordine, așteaptă-l cu waitid și WNOWAIT, apoi afișează-i starea din /proc, ca în exemplu
4. Apoi strânge fiecare copil, în ordine, cu waitpid și afișează-i codul de ieșire
5. La final, afișează încă o dată starea fiecărui copil. Fișierul lui din /proc a dispărut acum, așa că afișează `disparut`

Apelează fflush(stdout) înainte de fiecare fork

**Exemplu**

Intrare

```text
2
```

Ieșire

```text
copilul 1: Z
copilul 2: Z
copilul 1: iesire 10
copilul 2: iesire 20
copilul 1: disparut
copilul 2: disparut
```
