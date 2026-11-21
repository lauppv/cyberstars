Pe lângă bytes-ii lui, fiecare fișier are informații despre el însuși, ținute de kernel: cât de mare e, ce fel de lucru e, cine îl poate folosi, când a fost schimbat ultima dată. Apelul de sistem **stat** le citește pe toate într-un struct

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    int fd = open("banda.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "rola 7\n", 7);
    close(fd);

    struct stat st;
    if (stat("banda.txt", &st) == -1) {
        return 1;
    }
    printf("marime: %ld bytes\n", (long)st.st_size);
    return 0;
}
```

Ieșire

```text
marime: 7 bytes
```

Îi dăm lui stat un nume și adresa unui `struct stat`, iar el completează câmpurile. Întoarce -1 și setează errno când eșuează, ca open

---

Câmpurile pe care le folosim cel mai des

- `st_size`: mărimea în bytes
- `st_mode`: felul fișierului și permisiunile lui, strânse într-un singur număr
- `st_mtime`: când a fost schimbat ultima dată fișierul, în secunde de la 1970

Ca să întrebăm ce fel de lucru e, sys/stat.h are două ajutoare care primesc st_mode: **S_ISREG** e adevărat pentru un fișier obișnuit, **S_ISDIR** pentru un director, cuvântul din Unix pentru folder

```c
#include <stdio.h>
#include <sys/stat.h>

int main(void) {
    struct stat st;
    stat(".", &st);
    printf("%s\n", S_ISDIR(st.st_mode) ? "director" : "nu e director");
    return 0;
}
```

Ieșire

```text
director
```

`.` înseamnă mereu „folderul în care suntem”

---

Permisiunile sunt ultimii 9 biți din st_mode, aceiași biți ca 0644-ul dat lui open. Îi păstrăm doar pe ei cu o mască de biți și îi afișăm în octal cu **%o**

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    int fd = open("secret.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    close(fd);

    chmod("secret.txt", 0600);

    struct stat st;
    stat("secret.txt", &st);
    printf("%o\n", st.st_mode & 0777);
    return 0;
}
```

Ieșire

```text
600
```

**chmod** schimbă permisiunile unui fișier care există deja. Contează, pentru că modul dat lui open se aplică doar când O_CREAT chiar face un fișier nou. Dacă fișierul era deja acolo, își păstrează permisiunile vechi

---

## Misiune: Inspectorul de fișiere

Funcționarul de la arhivă pregătește fișiere de test și apoi le verifică. Programul tău le face pe amândouă, după comenzi scrise câte una pe linie, până se termină datele

1. `make nume bytes mod`: fă fișierul nou și gol, scrie în el atâtea caractere `x`, apoi pune-i permisiunile mod cu chmod. Modul e scris în octal, de exemplu 640: citește-l cu **%o** din scanf
2. `info nume`: uită-te la nume cu stat și afișează o linie
   - pentru un fișier obișnuit: `nume: fisier, N bytes, mod M`, cu M în octal
   - pentru un director: `nume: director`
   - dacă stat eșuează: `nume: ` și motivul dat de strerror

Numele au cel mult 30 de caractere. bytes e între 0 și 5000, iar mod e unul dintre 600, 640, 644, 700, 750 și 755

**Exemplu**

Intrare

```text
make report.txt 120 640
info report.txt
info .
info ghost.txt
make report.txt 5 600
info report.txt
```

Ieșire

```text
report.txt: fisier, 120 bytes, mod 640
.: director
ghost.txt: No such file or directory
report.txt: fisier, 5 bytes, mod 600
```
