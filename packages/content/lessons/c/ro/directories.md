Un director e un fișier special care ține o listă de nume. Fiecare nume arată spre un fișier sau spre alt director. Ca să citim lista, deschidem directorul cu **opendir**, luăm numele unul câte unul cu **readdir** și îl închidem cu **closedir**. Vin din dirent.h

```c
#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    mkdir("cutie", 0755);
    close(open("cutie/a.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644));

    DIR *dir = opendir("cutie");
    if (dir == NULL) {
        return 1;
    }
    struct dirent *intrare;
    while ((intrare = readdir(dir)) != NULL) {
        printf("%s\n", intrare->d_name);
    }
    closedir(dir);
    return 0;
}
```

Fiecare apel al lui readdir întoarce un pointer la următoarea intrare și NULL când nu mai sunt. Numele intrării e în `d_name`. Aici afișează trei nume, a.txt, `.` și `..`, într-o ordine oarecare

---

Două lucruri îi surprind pe toți

1. Fiecare director ține două nume în plus: `.` e directorul însuși, iar `..` e cel de deasupra lui. Când vrem doar conținutul adevărat, le sărim cu strcmp
2. Ordinea nu e alfabetică și nici ordinea în care am făcut fișierele. E ordinea în care le ține sistemul de fișiere. Dacă vrem o listă sortată, strângem numele și le sortăm noi, cu qsort

---

**mkdir** face un director nou, cu permisiuni ca la open. 0755 îi lasă pe toți să intre în el și să-l citească, dar doar pe noi să-l schimbăm. Dacă directorul există deja, mkdir eșuează cu EEXIST, ceea ce de multe ori e în regulă: voiam să fie acolo, și este

```c
#include <stdio.h>
#include <errno.h>
#include <sys/stat.h>

int main(void) {
    if (mkdir("cutie", 0755) == -1 && errno != EEXIST) {
        perror("mkdir cutie");
        return 1;
    }
    printf("cutie e acolo\n");
    return 0;
}
```

Ieșire

```text
cutie e acolo
```

**rmdir** șterge un director, dar doar unul gol. Ca să ștergem un director plin de fișiere, facem întâi unlink pe fiecare fișier din el

---

readdir ne dă doar numele, de exemplu a.txt, nu calea cutie/a.txt. Ca să deschidem fișierul sau să-i facem stat, construim calea întreagă: directorul, un `/` și numele

```c
#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    mkdir("cutie", 0755);
    close(open("cutie/a.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644));

    DIR *dir = opendir("cutie");
    if (dir == NULL) {
        return 1;
    }
    struct dirent *intrare;
    while ((intrare = readdir(dir)) != NULL) {
        if (strcmp(intrare->d_name, ".") == 0 || strcmp(intrare->d_name, "..") == 0) {
            continue;
        }
        char cale[300];
        strcpy(cale, "cutie/");
        strcat(cale, intrare->d_name);
        printf("%s\n", cale);
    }
    closedir(dir);
    return 0;
}
```

Ieșire

```text
cutie/a.txt
```

---

Să le punem cap la cap: listăm fișierele dintr-un director, sortate, cu mărimile lor

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int dupa_nume(const void *a, const void *b) {
    return strcmp(a, b);
}

int main(void) {
    mkdir("lada", 0755);
    int fd = open("lada/b.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "bbb", 3);
    close(fd);
    fd = open("lada/a.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "a", 1);
    close(fd);

    char nume[50][256];
    int numar = 0;
    DIR *dir = opendir("lada");
    struct dirent *intrare;
    while ((intrare = readdir(dir)) != NULL) {
        if (strcmp(intrare->d_name, ".") == 0 || strcmp(intrare->d_name, "..") == 0) {
            continue;
        }
        strcpy(nume[numar], intrare->d_name);
        numar++;
    }
    closedir(dir);

    qsort(nume, numar, sizeof(nume[0]), dupa_nume);

    for (int i = 0; i < numar; i++) {
        char cale[300];
        strcpy(cale, "lada/");
        strcat(cale, nume[i]);
        struct stat st;
        stat(cale, &st);
        printf("%s %ld\n", nume[i], (long)st.st_size);
    }
    return 0;
}
```

Ieșire

```text
a.txt 1
b.txt 3
```

Fiecare nume e un rând din array-ul 2D nume, iar qsort mută rânduri întregi. Funcția de comparare primește adresa unui rând, care e deja începutul unui șir, deci i-o poate da direct lui strcmp

---

## Misiune: Raftul arhivei

Arhiva își ține fișierele pe un raft: un director numit `shelf`. În fiecare seară, funcționarul golește raftul, pune pe el fișierele noi și scrie o listă cu ce e acolo

1. Fă directorul `shelf`. Dacă există deja, e în regulă
2. Golește-l: șterge fiecare fișier aflat deja în el. Citește-i numele cu readdir, sari peste `.` și `..` și fă unlink pe restul
3. Citește linii până se termină datele, fiecare cu un nume de fișier și o mărime. Fă fiecare fișier în shelf, cu atâtea caractere `x` în el
4. Citește din nou directorul și afișează-i fișierele în ordine alfabetică, fiecare cu mărimea dată de stat. Apoi afișează câte fișiere sunt și câți bytes țin împreună, ca în exemplu

Sunt între 1 și 50 de fișiere. Numele sunt un cuvânt de cel mult 30 de caractere, toate diferite, iar mărimile sunt între 0 și 2000

**Exemplu**

Intrare

```text
tape.txt 30
crew.txt 12
log.txt 0
```

Ieșire

```text
crew.txt 12
log.txt 0
tape.txt 30
Fisiere: 3, bytes: 42
```
