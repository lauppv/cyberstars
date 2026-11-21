Când un apel de sistem eșuează, de obicei întoarce -1. Asta ne spune **că** a eșuat, dar nu **de ce**. Lipsea fișierul? Nu aveam voie? Pentru „de ce” există **errno**, din errno.h

errno e un int global. Când un apel de sistem eșuează, motivul dat de kernel ajunge în errno, ca un număr cu un nume

```text
ENOENT    No such file or directory   (nu există fișierul sau folderul)
EEXIST    File exists                 (fișierul există deja)
EACCES    Permission denied           (acces interzis)
ENOTDIR   Not a directory             (nu e un folder)
EISDIR    Is a directory              (e un folder)
```

---

```c
#include <stdio.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("fantoma.txt", O_RDONLY);
    if (fd == -1) {
        if (errno == ENOENT) {
            printf("fisierul nu e acolo\n");
        } else {
            printf("alta problema\n");
        }
        return 1;
    }
    close(fd);
    return 0;
}
```

Ieșire

```text
fisierul nu e acolo
```

Două reguli despre errno

1. Citește-l doar când un apel tocmai a eșuat. Un apel care reușește nu pune errno înapoi la 0, deci o valoare veche poate sta încă acolo
2. Citește-l **imediat**. Următorul apel, chiar și un printf, îl poate schimba

---

Nu trebuie să ținem minte ce înseamnă fiecare număr. **strerror**, din string.h, face din errno o propoziție. Propozițiile sunt în engleză, așa cum le scrie biblioteca C

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>

int main(void) {
    int fd = open("fantoma.txt", O_RDONLY);
    if (fd == -1) {
        printf("open fantoma.txt: %s\n", strerror(errno));
    }
    return 0;
}
```

Ieșire

```text
open fantoma.txt: No such file or directory
```

---

**perror** face același lucru dintr-un singur apel și scrie la ieșirea de erori, descriptorul 2, care e locul potrivit pentru mesajele de eroare. Scrie textul nostru, două puncte și propoziția

```c
#include <stdio.h>
#include <fcntl.h>

int main(void) {
    int fd = open("fantoma.txt", O_RDONLY);
    if (fd == -1) {
        perror("open fantoma.txt");
        return 1;
    }
    return 0;
}
```

Pe ecran

```text
open fantoma.txt: No such file or directory
```

Textul arată la fel, dar merge în stderr, nu în stdout. Într-un terminal le vedem pe amândouă. Dar când ieșirea merge într-un fișier sau într-un pipe, acolo ajunge doar stdout, iar erorile ajung tot la omul din fața ecranului. De aceea programele adevărate își trimit erorile în stderr

---

Încă un apel util pentru fișiere: **unlink** scoate numele unui fișier din folderul lui, adică șterge fișierul. E în unistd.h și, ca celelalte, întoarce -1 și setează errno când eșuează

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("tmp.txt", O_WRONLY | O_CREAT | O_EXCL, 0644);
    close(fd);

    if (open("tmp.txt", O_WRONLY | O_CREAT | O_EXCL, 0644) == -1) {
        printf("a doua creare: %s\n", strerror(errno));
    }

    unlink("tmp.txt");
    if (unlink("tmp.txt") == -1) {
        printf("a doua stergere: %s\n", strerror(errno));
    }
    return 0;
}
```

Ieșire

```text
a doua creare: File exists
a doua stergere: No such file or directory
```

**O_EXCL** împreună cu O_CREAT înseamnă „creează-l doar dacă nu există încă”. Dacă fișierul e deja acolo, open eșuează cu EEXIST, în loc să deschidă fișierul vechi

---

## Misiune: Ghișeul de erori

Operatorii scriu comenzi pentru fișiere la un terminal și mai greșesc. În loc de un -1 de neînțeles, terminalul ar trebui să spună exact ce a mers prost

1. Citește comenzi, câte una pe linie, până se termină datele. Fiecare e un cuvânt și un nume de fișier
   - `create nume`: creează un fișier nou cu O_CREAT și O_EXCL, apoi închide-l
   - `open nume`: deschide fișierul pentru citire, apoi închide-l
   - `remove nume`: șterge fișierul cu unlink
2. Pentru fiecare comandă, afișează comanda, numele și `ok`, sau motivul pentru care a eșuat, găsit cu strerror, ca în exemplu
3. La final, afișează câte comenzi au eșuat

Numele au cel mult 30 de caractere

**Exemplu**

Intrare

```text
open ghost.txt
create notes.txt
create notes.txt
open notes.txt
open notes.txt/inside
remove notes.txt
remove notes.txt
```

Ieșire

```text
open ghost.txt: No such file or directory
create notes.txt: ok
create notes.txt: File exists
open notes.txt: ok
open notes.txt/inside: Not a directory
remove notes.txt: ok
remove notes.txt: No such file or directory
Esuate: 4
```

notes.txt e un fișier, nu un folder, deci nu poate fi nimic în el
