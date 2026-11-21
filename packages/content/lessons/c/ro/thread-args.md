În lecția despre thread-uri, fiecare thread primea un șir prin ultimul argument al lui pthread_create. Munca adevărată cere mai mult: ce parte din date să prelucreze și un loc unde să pună rezultatul. Calea obișnuită e un **struct**, câte unul pentru fiecare thread, dat ca acel singur argument

```c
#include <stdio.h>
#include <pthread.h>

struct lucrare {
    int de_la;
    int pana_la;
    long rezultat;
};

void *aduna_interval(void *arg) {
    struct lucrare *l = arg;
    long suma = 0;
    for (int x = l->de_la; x <= l->pana_la; x++) {
        suma = suma + x;
    }
    l->rezultat = suma;
    return NULL;
}

int main(void) {
    struct lucrare lucrari[2] = { { 1, 50, 0 }, { 51, 100, 0 } };
    pthread_t t[2];

    for (int i = 0; i < 2; i++) {
        pthread_create(&t[i], NULL, aduna_interval, &lucrari[i]);
    }
    for (int i = 0; i < 2; i++) {
        pthread_join(t[i], NULL);
    }

    printf("%ld + %ld = %ld\n", lucrari[0].rezultat, lucrari[1].rezultat,
           lucrari[0].rezultat + lucrari[1].rezultat);
    return 0;
}
```

Ieșire

```text
1275 + 3775 = 5050
```

Fiecare thread primește adresa propriului struct. Își citește intervalul din el și își scrie rezultatul înapoi în el. Thread-urile împart memoria, deci main vede rezultatele direct, fără pipe-uri. Și fiindcă fiecare thread scrie doar în struct-ul lui, nu ating niciodată același loc: nu e nevoie de mutex

---

O greșeală clasică: dăm fiecărui thread adresa variabilei din buclă

```text
for (int i = 0; i < 4; i++) {
    pthread_create(&t[i], NULL, lucreaza, &i);
}
```

Toate cele patru thread-uri primesc aceeași adresă, &i. Până când un thread o citește, bucla s-ar putea să fi mers deja mai departe, așa că două thread-uri pot vedea același număr, iar unele numere nu le vede nimeni. Fiecare thread are nevoie de locul lui: un array de struct-uri sau un array de int-uri, cu câte un loc pentru fiecare thread, care trăiește până termină thread-urile

---

Funcția thread-ului întoarce un `void *`, iar pthread_join îl poate prinde în al doilea argument. Deci un thread poate da înapoi un rezultat și ca pointer, de exemplu spre memorie luată cu malloc. Atunci main trebuie s-o elibereze

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

void *patrat(void *arg) {
    long n = *(long *)arg;
    long *valoare = malloc(sizeof(long));
    *valoare = n * n;
    return valoare;
}

int main(void) {
    pthread_t t;
    long n = 12;
    pthread_create(&t, NULL, patrat, &n);

    void *rezultat;
    pthread_join(t, &rezultat);
    long *valoare = rezultat;
    printf("%ld\n", *valoare);
    free(valoare);
    return 0;
}
```

Ieșire

```text
144
```

Scrierea în struct e de multe ori mai simplă și nu e nimic de eliberat

---

## Misiune: Suma pe bucăți

O listă lungă de citiri trebuie adunată repede, așa că munca e împărțită între mai multe thread-uri. Fiecare thread adună o bucată, iar main pune bucățile cap la cap

1. Citește k, numărul de thread-uri, apoi n, apoi cele n citiri
2. Împarte citirile în k bucăți, una după alta, cât mai egale. Cu n citiri, fiecare bucată primește n / k dintre ele, iar primele n % k bucăți primesc încă una
3. Pornește k thread-uri. Dă-i fiecăruia propriul struct, cu locul unde începe bucata lui, cât de lungă e, un pointer la citiri și loc pentru rezultat
4. Așteaptă-le pe toate, apoi afișează mărimea și suma fiecărei bucăți, și totalul, ca în exemplu

k e între 1 și 8, n între k și 100000, iar fiecare citire între -1000 și 1000

**Exemplu**

Intrare

```text
3
8
5 1 4 2 8 3 7 6
```

Ieșire

```text
bucata 1: 3 citiri, suma 10
bucata 2: 3 citiri, suma 13
bucata 3: 2 citiri, suma 13
total: 36
```
