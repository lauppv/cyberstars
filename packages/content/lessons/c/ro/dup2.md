În shell, `ls > lista.txt` trimite ieșirea lui ls într-un fișier în loc de ecran, iar `sort < nume.txt` îl face pe sort să citească dintr-un fișier în loc de tastatură. Asta se numește **redirecționare**. Și nu e nicio magie în ls sau sort: ele scriu tot în descriptorul 1 și citesc din 0, ca mereu. Shell-ul doar schimbă spre ce arată 1 și 0, înainte să le pornească

Apelul de sistem pentru asta e **dup2**

---

`dup2(fd_vechi, fd_nou)` face ca fd_nou să arate spre același lucru ca fd_vechi. Dacă fd_nou era deschis, e închis întâi

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("raport.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    dup2(fd, 1);
    close(fd);

    printf("asta merge in fisier\n");
    return 0;
}
```

Pe ecran nu apare nimic. După dup2, descriptorul 1 e fișierul, deci printf, care scrie în 1, scrie în raport.txt. Închidem fd imediat: 1 arată deja spre fișier și nu avem nevoie de două numere pentru el

---

Puterea adevărată vine împreună cu fork și exec. Copilul redirecționează, apoi rulează un program. Programul nu află niciodată: scrie în 1, iar 1 e fișierul nostru

```c
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        int fd = open("numere.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
        dup2(fd, 1);
        close(fd);
        execlp("seq", "seq", "3", NULL);
        _exit(127);
    }
    waitpid(pid, NULL, 0);

    pid = fork();
    if (pid == 0) {
        int fd = open("numere.txt", O_RDONLY);
        dup2(fd, 0);
        close(fd);
        execlp("sort", "sort", "-r", NULL);
        _exit(127);
    }
    waitpid(pid, NULL, 0);
    return 0;
}
```

Ieșire

```text
3
2
1
```

Primul copil e `seq 3 > numere.txt`. Al doilea e `sort -r < numere.txt`: sort citește din 0, care acum e fișierul, și scrie pe ecran ca de obicei. 0 și 1 ale părintelui nu se schimbă niciodată, pentru că fiecare copil și-a schimbat doar propriile copii

---

Fiindcă ieșirea programului merge acum în fișier, un mesaj de eroare afișat cu printf ar ajunge și el acolo. Exact de aceea există stderr, descriptorul 2: pe el nu l-am redirecționat, deci erorile ajung tot pe ecran

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char *argumente[] = { "nuexista", NULL };

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        int fd = open("iesire.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
        dup2(fd, 1);
        close(fd);
        execvp(argumente[0], argumente);
        perror(argumente[0]);
        _exit(127);
    }

    int stare;
    waitpid(pid, &stare, 0);
    printf("exit %d\n", WEXITSTATUS(stare));
    return 0;
}
```

Ieșire

```text
nuexista: No such file or directory
exit 127
```

---

Dacă părintele are nevoie mai târziu de vechiul lui stdout, poate păstra întâi o copie cu **dup**, care întoarce un număr nou care arată spre același loc

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("jurnal.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);

    int salvat = dup(1);
    dup2(fd, 1);
    printf("asta merge in fisier\n");
    fflush(stdout);
    dup2(salvat, 1);
    close(salvat);
    close(fd);

    printf("din nou pe ecran\n");
    FILE *f = fopen("jurnal.txt", "r");
    char linie[64];
    fgets(linie, sizeof(linie), f);
    printf("fisierul are: %s", linie);
    fclose(f);
    return 0;
}
```

Ieșire

```text
din nou pe ecran
fisierul are: asta merge in fisier
```

Observă fflush-ul dinainte de comutarea înapoi: textul care încă așteaptă în bufferul lui printf ar ajunge altfel în partea greșită

---

## Misiune: Prinzătorul de ieșire

Operatorii vor să salveze ce afișează programele, să se uite la asta mai târziu și să le-o dea altor programe

1. Citește comenzi, câte una pe linie, până se termină datele
   - `run fisier program argumente...`: rulează programul într-un copil, cu ieșirea standard mergând în fisier, făcut întâi nou și gol. Când a terminat, afișează numele fișierului și mărimea lui, ca în exemplu
   - `feed fisier program argumente...`: rulează programul într-un copil, cu intrarea standard venind din fisier. Ieșirea lui merge pe ecran, ca de obicei
   - `show fisier`: afișează ce e în fișier
2. Dacă exec eșuează, copilul afișează eroarea cu perror, care merge în stderr, și iese cu 127
3. Apelează fflush(stdout) înainte de fiecare fork

Liniile au cel mult 100 de caractere și 10 cuvinte. Programele citesc date doar la feed, iar un fișier dat la feed există mereu

**Exemplu**

Intrare

```text
run list.txt seq 3
show list.txt
feed list.txt sort -r
feed list.txt wc -l
run out.txt nosuchcmd
```

Ieșire

```text
list.txt: 6 bytes
1
2
3
3
2
1
3
out.txt: 0 bytes
```

Fișierul comenzii eșuate e făcut totuși, dar gol: copilul l-a deschis înainte să eșueze exec
