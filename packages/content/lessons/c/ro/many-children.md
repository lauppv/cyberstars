Până acum, părintele nostru făcea un copil, îl aștepta, apoi îl făcea pe următorul. Copiii veneau pe rând. Dar rostul mai multor procese e că pot lucra **în același timp**. Pe o mașină cu mai multe nuclee de procesor chiar rulează unul lângă altul

Pentru asta, părintele pornește întâi toți copiii și abia apoi îi așteaptă

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    for (int i = 1; i <= 3; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(i);
        }
    }

    int suma = 0;
    int stare;
    while (wait(&stare) > 0) {
        suma = suma + WEXITSTATUS(stare);
    }
    printf("suma codurilor: %d\n", suma);
    return 0;
}
```

Ieșire

```text
suma codurilor: 6
```

Uită-te la copil: apelează \_exit în interiorul buclei. Fără asta, copilul s-ar întoarce în buclă și ar porni copii proprii, iar am avea mult mai multe procese decât voiam

---

`wait(&stare)` așteaptă **orice** copil, pe cel care se termină primul, și întoarce PID-ul lui. Când nu mai sunt copii, întoarce -1. Deci `while (wait(&stare) > 0)` îi strânge pe toți, oricâți ar fi

Ordinea nu e fixă. Copilul pornit ultimul se poate termina primul. Dacă munca e diferită pentru fiecare copil sau mașina e ocupată, ordinea se schimbă de la o rulare la alta

---

Atunci cum știm ce răspuns e al cărui copil? Păstrăm PID-urile întoarse de fork într-un array, în ordinea în care am pornit copiii. Când wait ne dă un PID, îl căutăm în acel array

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int lucreaza(int i) {
    return (i + 1) * 10;
}

int main(void) {
    int n = 3;
    pid_t pids[10];
    int rezultate[10];

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            _exit(lucreaza(i));
        }
    }

    for (int k = 0; k < n; k++) {
        int stare;
        pid_t gata = wait(&stare);
        for (int i = 0; i < n; i++) {
            if (pids[i] == gata) {
                rezultate[i] = WEXITSTATUS(stare);
            }
        }
    }

    for (int i = 0; i < n; i++) {
        printf("copilul %d: %d\n", i, rezultate[i]);
    }
    return 0;
}
```

Ieșire

```text
copilul 0: 10
copilul 1: 20
copilul 2: 30
```

După asta, rezultate[i] ține răspunsul copilului i, indiferent de ordinea în care s-au terminat. Apoi putem afișa totul într-o ordine fixă

---

De ce să nu-l lăsăm pe fiecare copil să-și afișeze singur răspunsul? Pentru că afișează în același timp, iar liniile lor ies amestecate, în altă ordine la fiecare rulare. Pentru un raport care trebuie să arate la fel de fiecare dată, copiii doar calculează, iar doar părintele afișează

---

## Misiune: Verificatorii paraleli

Stația trebuie să verifice un lot de numere: e fiecare prim? Fiecare verificare rulează în copilul ei, iar toți copiii rulează în același timp

1. Citește un număr întreg n, apoi n numere
2. Pornește întâi toți cei n copii. Copilul i verifică numărul i și iese cu 1 dacă e prim, cu 0 dacă nu e
3. Abia apoi strânge toți copiii cu wait, în orice ordine s-ar termina. Potrivește fiecare PID cu numărul lui
4. Afișează rezultatele în ordinea de la intrare, apoi câte au fost prime, ca în exemplu

Ține minte că un număr prim are exact doi divizori: 1 și el însuși. Deci 1 nu e prim. n e între 1 și 8, iar fiecare număr e între 1 și 1000000. Apelează fflush(stdout) înainte de fiecare fork

**Exemplu**

Intrare

```text
4
7 12 1 999983
```

Ieșire

```text
7: prim
12: nu e prim
1: nu e prim
999983: prim
Prime: 2
```
