fork face o copie a programului care rulează deja. Dar cum pornește un shell un program cu totul diferit, ca ls sau sort? Cu familia de apeluri de sistem **exec**. exec aruncă codul procesului curent și încarcă alt program în locul lui. Același proces, același PID, program nou

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("inainte de exec\n");
    fflush(stdout);
    execlp("echo", "echo", "salut", "de", "la", "echo", NULL);
    printf("linia asta nu ruleaza niciodata\n");
    return 0;
}
```

Ieșire

```text
inainte de exec
salut de la echo
```

După un exec reușit, programul nostru nu mai există. În locul lui rulează acum programul echo, care își afișează linia și se termină. De aceea ultimul printf nu mai are loc: nu există un „după” la care să ne întoarcem. **exec se întoarce doar când eșuează**, iar atunci întoarce -1

---

Familia are mai mulți membri. Literele din numele lor spun cum primesc argumentele

- **l** (listă): argumentele unul câte unul, terminate cu NULL: `execlp("echo", "echo", "hi", NULL)`
- **v** (vector): argumentele într-un array de șiruri care se termină cu NULL
- **p** (path): caută programul în folderele din PATH, deci putem scrie `"echo"` în loc de `"/usr/bin/echo"`

Primul argument e programul de rulat. Apoi vin argumentele pe care le primește programul, iar din obișnuință primul dintre ele e tot numele programului. NULL-ul de la final îi spune lui exec unde se termină lista, deci nu-l uita niciodată

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    char *argumente[] = { "expr", "6", "*", "7", NULL };
    execvp(argumente[0], argumente);
    printf("exec a esuat\n");
    return 1;
}
```

Ieșire

```text
42
```

execvp e cel pe care îl folosim când argumentele vin de la intrare, pentru că putem umple un array pe măsură ce citim

---

Singur, exec ne termină programul. Rareori vrem asta. Așa că tiparul clasic, cel folosit de orice shell, e **fork, apoi exec în copil, apoi wait în părinte**

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char *argumente[] = { "seq", "3", NULL };

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        execvp(argumente[0], argumente);
        printf("%s: comanda nu exista\n", argumente[0]);
        fflush(stdout);
        _exit(127);
    }

    int stare;
    waitpid(pid, &stare, 0);
    printf("seq s-a terminat cu %d\n", WEXITSTATUS(stare));
    return 0;
}
```

Ieșire

```text
1
2
3
seq s-a terminat cu 0
```

Copilul devine seq. Părintele rămâne el însuși, așteaptă și citește codul de ieșire al lui seq, ca pe al oricărui copil. Dacă exec eșuează, de exemplu pentru că nu există un astfel de program, copilul trebuie să se oprească pe loc, cu \_exit, ca în lecția trecută. Altfel ar continua să ruleze codul părintelui și am avea doi părinți. 127 e numărul folosit de shell-uri pentru „comanda nu există”

---

Un program pornit cu exec păstrează descriptorii de fișier deschiși ai procesului. Ieșirea lui merge unde mergea a noastră și citește de la intrarea noastră. Așa afișează comenzile unui shell în același terminal. Și asta ne va lăsa să le redirecționăm, în lecțiile următoare

---

## Misiune: Lansatorul de comenzi

Operatorii vor să ruleze programe dintr-un lansator simplu, câte o comandă pe linie, și să vadă cum s-a terminat fiecare

1. Citește linii până se termină datele. Fiecare linie e o comandă: numele unui program, apoi argumentele lui, despărțite prin spații
2. Împarte linia în cuvinte cu strtok și pune-le într-un array de șiruri care se termină cu NULL
3. Fă un copil cu fork. Copilul rulează comanda cu execvp. Dacă exec eșuează, copilul afișează numele și `: comanda nu exista`, apoi iese cu 127
4. Părintele așteaptă copilul și afișează `[iesire N]`, cu codul de ieșire al copilului

Apelează fflush(stdout) înainte de fiecare fork. Liniile au cel mult 100 de caractere și cel mult 10 cuvinte. Comenzile nu citesc nimic de la intrare

**Exemplu**

Intrare

```text
echo hello tape room
false
nosuchcmd x
expr 6 * 7
```

Ieșire

```text
hello tape room
[iesire 0]
[iesire 1]
nosuchcmd: comanda nu exista
[iesire 127]
42
[iesire 0]
```

false e un program mic care nu face nimic și iese cu 1. expr face calcule cu argumentele lui
