Să scrii **struct Jucator** peste tot devine obositor. **typedef** ne lasă să creăm un nume mai scurt pentru orice tip

```c
#include <stdio.h>

typedef struct {
    char nume[50];
    int viata;
    int scor;
} Jucator;

int main(void) {
    Jucator j = {"Tommy", 100, 500};
    printf("%s: %d HP\n", j.nume, j.viata);
    return 0;
}
```

Acum scriem **Jucator** în loc de **struct Jucator**. Mult mai curat. Așa își definesc majoritatea codebase-urilor C struct-urile

---

Tiparul este **typedef tip_existent nume_nou**

```c
#include <stdio.h>

typedef int Scor;
typedef char* Sir;

int main(void) {
    Scor scor_maxim = 9999;
    Sir nume = "Vercetti";
    printf("%d %s\n", scor_maxim, nume);
    return 0;
}
```

Putem da nume cu sens tipurilor. **Scor** este tot un int dedesubt, dar numele îți spune ce reprezintă

---

**typedef** strălucește cu adevărat cu pointeri la funcții (dacă ești curios) și prin eliminarea cuvântului cheie **struct**. Iată cel mai comun tipar pe care îl vei vedea în codul real

```c
#include <stdio.h>

typedef struct {
    double x;
    double y;
} Punct;

typedef struct {
    Punct centru;
    double raza;
} Cerc;

void afiseaza_cerc(Cerc *c) {
    printf("Centru: (%.1f, %.1f), Raza: %.1f\n",
           c->centru.x, c->centru.y, c->raza);
}

int main(void) {
    Cerc c = {{2.0, 3.0}, 5.0};
    afiseaza_cerc(&c);
    return 0;
}
```

Observă cum putem folosi **Punct** în interiorul lui **Cerc**. Struct-uri în struct-uri — **compoziție**. Așa construiesc programele C structuri de date complexe fără clase

---

## Misiune: Raport de Performanță al Echipajului

Căpitanul stației vrea un raport formatat al scorurilor de performanță ale membrilor echipajului. Folosește **typedef** pentru a defini un struct curat și parcurge lista.

1. Definește un struct **typedef** numit **MembruEchipaj** cu câmpurile: **nume** (array de char), **grad** (int), **evaluare** (double)
2. Creează un array de **3 membri ai echipajului** cu valorile arătate mai jos
3. Parcurge-i și afișează fiecare în formatul **"Nume - Grad X - Evaluare Y.YY"**

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- **"Tommy"**, grad **10**, evaluare **9.50**
- **"Lance"**, grad **11**, evaluare **8.20**
- **"Cortez"**, grad **10**, evaluare **9.80**

**Exemplu**

Cu valorile de pornire, programul tău ar trebui să afișeze

```text
Tommy - Grad 10 - Evaluare 9.50
Lance - Grad 11 - Evaluare 8.20
Cortez - Grad 10 - Evaluare 9.80
```
