Până acum am stocat valori simple: un int, un char, un șir. Dar dacă vrem să reprezentăm un **angajat** al centrului de calcul, cu nume, tură și număr de sarcini rezolvate? Am putea folosi trei variabile separate, dar lucrurile se complică repede când avem zeci de angajați. Aici intră în scenă **struct-urile**

Un **struct** este o modalitate de a grupa date înrudite într-un singur tip. Gândește-te la el ca la o cutie personalizată care conține mai multe câmpuri

```c
#include <stdio.h>
#include <string.h>

struct Angajat {
    char nume[50];
    int tura;
    int sarcini;
};

int main(void) {
    struct Angajat a1;
    strcpy(a1.nume, "op7");
    a1.tura = 2;
    a1.sarcini = 0;

    printf("Nume: %s\n", a1.nume);
    printf("Tura: %d\n", a1.tura);
    printf("Sarcini: %d\n", a1.sarcini);
    return 0;
}
```

**Definim** struct-ul cu **struct Angajat { ... };** — observă **punctul și virgula** după acolada de închidere. Apoi **creăm** o variabilă de tipul acela cu **struct Angajat a1**. Accesăm câmpurile cu **operatorul punct**: **a1.tura**

---

Putem inițializa și un struct dintr-o singură mișcare

```c
#include <stdio.h>

struct Angajat {
    char nume[50];
    int tura;
    int sarcini;
};

int main(void) {
    struct Angajat a1 = {"op7", 2, 5};
    printf("%s: tura %d, %d sarcini\n", a1.nume, a1.tura, a1.sarcini);
    return 0;
}
```

Valorile completează câmpurile **în ordine**: nume, tură, sarcini. Sau, mai explicit

```c
#include <stdio.h>

struct Angajat {
    char nume[50];
    int tura;
    int sarcini;
};

int main(void) {
    struct Angajat a1 = {.nume = "op7", .tura = 2, .sarcini = 5};
    printf("%s: tura %d, %d sarcini\n", a1.nume, a1.tura, a1.sarcini);
    return 0;
}
```

A doua formă este mai clară — vezi exact ce valoare primește fiecare câmp

---

Array-urile de struct-uri sunt super utile

```c
#include <stdio.h>

struct Angajat {
    char nume[50];
    int tura;
    int sarcini;
};

int main(void) {
    struct Angajat echipa[3] = {
        {"op7", 1, 5},
        {"op12", 2, 3},
        {"op9", 3, 8}
    };

    for (int i = 0; i < 3; i++) {
        printf("%s: tura %d, %d sarcini\n", echipa[i].nume, echipa[i].tura, echipa[i].sarcini);
    }
    return 0;
}
```

Ieșire

```text
op7: tura 1, 5 sarcini
op12: tura 2, 3 sarcini
op9: tura 3, 8 sarcini
```

---

## Misiune: Inventarul Arhivei de Benzi Magnetice

Arhiva centrului de calcul ține evidența fiecărei bobine de bandă magnetică pe care s-au stocat programe și rezultate. Șeful arhivei vrea un raport rapid, generat direct din registrul de intrare.

1. Definește un struct **Banda** cu câmpurile: **eticheta** (array de char), **an** (int), **metri** (int)
2. Citește **două** benzi din input: pe fiecare linie, o etichetă (un singur cuvânt, fără spații), un an și o lungime în metri
3. Afișează fiecare bandă în formatul **"Eticheta (An) - Metri m"**

**Exemplu**

Intrare

```text
IBM7090 1969 730
DEC10 1972 500
```

Ieșire

```text
IBM7090 (1969) - 730 m
DEC10 (1972) - 500 m
```

**Exemplu**

Intrare

```text
UNIVAC 1965 900
PDP7 1970 250
```

Ieșire

```text
UNIVAC (1965) - 900 m
PDP7 (1970) - 250 m
```
