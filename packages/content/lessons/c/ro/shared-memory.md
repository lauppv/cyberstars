După fork, părintele și copilul au fiecare propria copie a memoriei. Dacă copilul schimbă o variabilă, părintele nu vede niciodată schimbarea. E sigur, dar trimiterea rezultatelor înapoi devine grea. Codul de ieșire ține doar un byte, de la 0 la 255, iar un pipe cere citire și scriere de ambele părți

Există o cale mai directă: memorie pe care ambele procese chiar o împart. O cerem kernelului cu **mmap**, din sys/mman.h, înainte de fork

---

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

int main(void) {
    int normal = 0;
    int *comun = mmap(NULL, sizeof(int), PROT_READ | PROT_WRITE,
                      MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    *comun = 0;

    fflush(stdout);
    if (fork() == 0) {
        normal = 500;
        *comun = 500;
        _exit(0);
    }
    wait(NULL);

    printf("normal: %d\n", normal);
    printf("comun: %d\n", *comun);
    munmap(comun, sizeof(int));
    return 0;
}
```

Ieșire

```text
normal: 0
comun: 500
```

Copilul le-a schimbat pe amândouă. Părintele o vede doar pe cea comună, pentru că acea pagină de memorie e aceeași în ambele procese, nu o copie

---

mmap primește multe argumente. Pentru memorie împărțită între un părinte și copiii lui, le scriem mereu la fel

- `NULL`: lasă kernelul să aleagă adresa
- mărimea, în bytes
- `PROT_READ | PROT_WRITE`: vrem să citim și să scriem în ea
- `MAP_SHARED | MAP_ANONYMOUS`: împărțită cu copiii noștri și fără un fișier în spate
- `-1, 0`: niciun fișier, niciun offset

Întoarce un pointer, ca malloc. Când eșuează întoarce **MAP_FAILED**, nu NULL, deci pe acela îl verificăm. Când am terminat, **munmap** o dă înapoi, ca free

---

Putem cere loc pentru mai multe valori deodată și putem folosi pointerul ca pe un array

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

int main(void) {
    int n = 3;
    long *rezultate = mmap(NULL, n * sizeof(long), PROT_READ | PROT_WRITE,
                           MAP_SHARED | MAP_ANONYMOUS, -1, 0);

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            rezultate[i] = (i + 1) * 100;
            _exit(0);
        }
    }
    for (int i = 0; i < n; i++) {
        wait(NULL);
    }

    for (int i = 0; i < n; i++) {
        printf("%ld\n", rezultate[i]);
    }
    return 0;
}
```

Ieșire

```text
100
200
300
```

Fiecare copil scrie doar în locul lui, rezultate[i]. Fiindcă niciun proces nu scrie în același loc cu altul, nu se pot încurca. Când două procese scriu în **același** loc în același timp, avem o condiție de cursă (race condition), ca la thread-uri, și ne-ar trebui un semafor ca să vină pe rând

---

Părintele nu trebuie să citească rezultatele înainte ca copiii să le fi scris. Așteptarea fiecărui copil cu wait e ce face asta sigur: după ultimul wait, toată munca e gata

---

## Misiune: Recensământul numerelor prime

Biroul de recensământ vrea să știe câte numere prime sunt până la mai multe limite. Numărătoarea e lentă, așa că fiecare limită primește copilul ei, iar toți rulează deodată. Rezultatele pot fi mari, mult peste 255, deci nu se pot întoarce prin codul de ieșire

1. Citește un număr întreg n, apoi n limite
2. Fă cu mmap un array comun de n long-uri, înainte de orice fork
3. Pornește toți cei n copii. Copilul i numără numerele prime de la 2 până la limita i, inclusiv ambele capete, scrie rezultatul în locul i și iese
4. Așteaptă toți copiii. Apoi afișează fiecare limită cu numărul ei, în ordinea de la intrare, și totalul tuturor numerelor, ca în exemplu
5. Dă memoria înapoi cu munmap

n e între 1 și 8, iar fiecare limită e între 1 și 100000. Apelează fflush(stdout) înainte de fiecare fork

**Exemplu**

Intrare

```text
3
10 100 1
```

Ieșire

```text
pana la 10: 4
pana la 100: 25
pana la 1: 0
Total: 29
```
