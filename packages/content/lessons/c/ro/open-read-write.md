Ca să lucrăm cu un fișier prin apeluri de sistem, îi cerem întâi kernelului să-l **deschidă** (open). Ne dă înapoi un descriptor de fișier, numărul mic din lecția trecută, iar de atunci citim și scriem prin acel număr. Când am terminat, îl **închidem** (close)

```c
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("nota.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "prima linie\n", 12);
    close(fd);

    char buf[64];
    fd = open("nota.txt", O_RDONLY);
    ssize_t n = read(fd, buf, sizeof(buf));
    close(fd);

    write(1, buf, n);
    return 0;
}
```

Ieșire

```text
prima linie
```

open vine din fcntl.h. Primește numele fișierului, apoi niște **flag-uri** care spun cum vrem să folosim fișierul, unite cu `|`

- `O_RDONLY` doar citire, `O_WRONLY` doar scriere, `O_RDWR` amândouă
- `O_CREAT` creează fișierul dacă nu există
- `O_TRUNC` dacă există, golește-l întâi
- `O_APPEND` fiecare write merge la finalul fișierului

---

Ultimul număr, 0644, e necesar doar cu O_CREAT. Stabilește cine poate folosi fișierul nou. 0-ul din față îl face număr **octal**, în care fiecare cifră înseamnă 3 biți: citire (4), scriere (2), rulare (1). Cele trei cifre sunt pentru proprietar, pentru grup și pentru toți ceilalți

```text
0644  ->  proprietar rw-  grup r--  ceilalti r--
```

Deci 0644 înseamnă „eu pot citi și scrie, ceilalți pot doar citi”. E alegerea cea mai obișnuită pentru un fișier simplu

---

open întoarce -1 când nu poate deschide fișierul: nu există sau nu avem voie. Verifică mereu asta înainte să folosești fd

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("nu_exista.txt", O_RDONLY);
    if (fd == -1) {
        printf("nu l-am putut deschide\n");
        return 1;
    }
    close(fd);
    return 0;
}
```

Ieșire

```text
nu l-am putut deschide
```

---

Cu O_APPEND, putem adăuga într-un fișier fără să pierdem ce e deja acolo

```c
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("jurnal.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "start\n", 6);
    close(fd);

    fd = open("jurnal.txt", O_WRONLY | O_APPEND);
    write(fd, "inca\n", 5);
    close(fd);

    char buf[64];
    fd = open("jurnal.txt", O_RDONLY);
    ssize_t n = read(fd, buf, sizeof(buf));
    close(fd);
    write(1, buf, n);
    return 0;
}
```

Ieșire

```text
start
inca
```

Fără O_APPEND, al doilea write ar porni de la începutul fișierului și ar acoperi „start”

---

De ce să învățăm open, când avem deja fopen? Pentru că fopen e construit peste open. fopen adaugă un buffer și funcții comode ca fprintf, dar dedesubt fiecare FILE are un descriptor de fișier. Știind open, știm ce se întâmplă de fapt, iar în lecțiile următoare vom avea nevoie de descriptori pentru lucruri pe care fopen nu le poate face

Fiecare proces poate avea deschiși doar un număr limitat de descriptori deodată. De aceea contează close: un program care deschide fișiere într-o buclă și nu le închide niciodată va primi într-o zi -1 de la open

---

## Misiune: Copia benzii

Înainte ca o bandă să plece la arhivă, stația îi face o copie pe disc și îi pune o ștampilă la final. Apoi citește copia înapoi, ca să fie sigură că e toată acolo

1. Citește toate datele de intrare. Scrie-le în fișierul `copy.txt`, făcând întâi fișierul nou și gol
2. Închide-l, apoi deschide-l din nou cu O_APPEND și adaugă linia `end of tape`
3. Închide-l, deschide-l pentru citire și afișează tot fișierul la ieșire, cu read și write
4. Afișează o ultimă linie cu mărimea fișierului în bytes, ca în exemplu

Folosește open, read, write și close pentru fișier, nu fopen. Intrarea are cel mult 4000 de bytes și se termină cu o linie nouă

**Exemplu**

Intrare

```text
reel 7
payroll 1969
```

Ieșire

```text
reel 7
payroll 1969
end of tape
Marime: 32 bytes
```
