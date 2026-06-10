Până acum am stocat valori simple: un int, un char, un șir. Dar dacă vrem să reprezentăm un **jucător** cu nume, viață și scor? Am putea folosi trei variabile separate, dar lucrurile se complică repede. Aici intră în scenă **struct-urile**

Un **struct** este o modalitate de a grupa date înrudite într-un singur tip. Gândește-te la el ca la o cutie personalizată care conține mai multe lucruri

```c
#include <stdio.h>
#include <string.h>

struct Jucator {
    char nume[50];
    int viata;
    int scor;
};

int main(void) {
    struct Jucator j1;
    strcpy(j1.nume, "Tommy");
    j1.viata = 100;
    j1.scor = 0;

    printf("Nume: %s\n", j1.nume);
    printf("Viata: %d\n", j1.viata);
    printf("Scor: %d\n", j1.scor);
    return 0;
}
```

**Definim** struct-ul cu **struct Jucator { ... };** — observă **punctul și virgula** după acolada de închidere. Apoi **creăm** o variabilă de tipul acela cu **struct Jucator j1**. Accesăm câmpurile cu **operatorul punct**: **j1.viata**

---

Dacă știi Java, un struct este similar cu o clasă cu doar câmpuri publice și fără metode. Dacă știi Python, gândește-te la el ca la un obiect simplu cu doar atribute. C nu are clase sau metode — struct-urile sunt instrumentul nostru pentru organizarea datelor

---

Putem inițializa și un struct dintr-o singură mișcare

```c
#include <stdio.h>

struct Jucator {
    char nume[50];
    int viata;
    int scor;
};

int main(void) {
    struct Jucator j1 = {"Vercetti", 100, 500};
    printf("%s: %d HP, %d pts\n", j1.nume, j1.viata, j1.scor);
    return 0;
}
```

Valorile completează câmpurile **în ordine**: nume, viață, scor. Sau, mai explicit

```c
#include <stdio.h>

struct Jucator {
    char nume[50];
    int viata;
    int scor;
};

int main(void) {
    struct Jucator j1 = {.nume = "Vercetti", .viata = 100, .scor = 500};
    printf("%s: %d HP, %d pts\n", j1.nume, j1.viata, j1.scor);
    return 0;
}
```

A doua formă este mai clară — vezi exact ce valoare primește fiecare câmp

---

Array-urile de struct-uri sunt super utile

```c
#include <stdio.h>

struct Jucator {
    char nume[50];
    int viata;
    int scor;
};

int main(void) {
    struct Jucator echipa[3] = {
        {"Tommy", 100, 500},
        {"Lance", 80, 300},
        {"Ken", 60, 100}
    };

    for (int i = 0; i < 3; i++) {
        printf("%s: %d HP, %d pts\n", echipa[i].nume, echipa[i].viata, echipa[i].scor);
    }
    return 0;
}
```

Output

```text
Tommy: 100 HP, 500 pts
Lance: 80 HP, 300 pts
Ken: 60 HP, 100 pts
```

---

## Misiune: Raport Inventar Flotă

Hangarul stației are nevoie de un inventar rapid al navetelor sale. Definește un struct care să reprezinte fiecare vehicul și afișează un manifest formatat pentru Comandantul Lance.

1. Definește un struct **Masina** cu câmpurile: **marca** (array de char), **an** (int), **km** (int)
2. Creează **două** mașini cu valorile arătate mai jos
3. Afișează fiecare în formatul **"Marca (An) - Km km"**

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- Mașina 1: **"BMW"**, **2015**, **120000**
- Mașina 2: **"Dacia"**, **2020**, **45000**

**Exemplu**

Cu valorile de pornire, programul tău ar trebui să afișeze

```text
BMW (2015) - 120000 km
Dacia (2020) - 45000 km
```
