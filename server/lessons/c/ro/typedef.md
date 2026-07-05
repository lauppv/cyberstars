Să scrii **struct Angajat** peste tot devine obositor. **typedef** ne lasă să creăm un nume mai scurt pentru orice tip

```c
#include <stdio.h>

typedef struct {
    char nume[50];
    int tura;
    int sarcini;
} Angajat;

int main(void) {
    Angajat a = {"op7", 2, 5};
    printf("%s: tura %d\n", a.nume, a.tura);
    return 0;
}
```

Acum scriem **Angajat** în loc de **struct Angajat**. Mult mai curat. Așa își definesc majoritatea codebase-urilor C struct-urile

---

Tiparul este **typedef tip_existent nume_nou**

```c
#include <stdio.h>

typedef int Ore;
typedef char* Sir;

int main(void) {
    Ore ore_lucrate = 9999;
    Sir nume = "op7";
    printf("%d %s\n", ore_lucrate, nume);
    return 0;
}
```

Putem da nume cu sens tipurilor. **Ore** este tot un int dedesubt, dar numele îți spune ce reprezintă

---

**typedef** strălucește cu adevărat cu pointeri la funcții (dacă ești curios) și prin eliminarea cuvântului cheie **struct**. Iată cel mai comun tipar pe care îl vei vedea în codul real

```c
#include <stdio.h>

typedef struct {
    int registru;
    int valoare;
} Celula;

typedef struct {
    Celula prima;
    int total;
} Banca;

void afiseaza_banca(Banca *b) {
    printf("Registru: %d, Valoare: %d, Total: %d\n",
           b->prima.registru, b->prima.valoare, b->total);
}

int main(void) {
    Banca b = {{0, 512}, 512};
    afiseaza_banca(&b);
    return 0;
}
```

Observă cum putem folosi **Celula** în interiorul lui **Banca**. Struct-uri în struct-uri — **compoziție**. Așa construiesc programele C structuri de date complexe fără clase

---

## Misiune: Raportul de Performanță al Turei

Șeful de tură vrea un raport formatat al evaluărilor operatorilor din centrul de calcul. Folosește **typedef** pentru a defini un struct curat și parcurge lista.

1. Definește un struct **typedef** numit **Operator** cu câmpurile: **nume** (array de char), **grad** (int), **evaluare** (double)
2. Citește din input un număr **n** de operatori, urmat de **n** linii, fiecare cu **nume grad evaluare**
3. Parcurge-i și afișează fiecare în formatul **"Nume - Grad X - Evaluare Y.YY"**

**Exemplu**

Intrare

```text
3
op1 10 9.50
op2 11 8.20
op3 10 9.80
```

Ieșire

```text
op1 - Grad 10 - Evaluare 9.50
op2 - Grad 11 - Evaluare 8.20
op3 - Grad 10 - Evaluare 9.80
```

**Exemplu**

Intrare

```text
2
tura1 7 6.75
tura2 9 8.00
```

Ieșire

```text
tura1 - Grad 7 - Evaluare 6.75
tura2 - Grad 9 - Evaluare 8.00
```
