Și codul unei funcții stă în memorie, deci o funcție are o adresă, la fel ca o variabilă. Putem ține acea adresă într-un pointer și putem apela funcția prin el. Acesta e un **pointer la funcție**

```c
#include <stdio.h>

int aduna(int a, int b) {
    return a + b;
}

int inmulteste(int a, int b) {
    return a * b;
}

int main(void) {
    int (*op)(int, int) = aduna;
    printf("%d\n", op(6, 7));

    op = inmulteste;
    printf("%d\n", op(6, 7));
    return 0;
}
```

Ieșire

```text
13
42
```

---

Declarația arată ciudat, așa că s-o citim încet

```text
int (*op)(int, int)
```

- `*op`: op e un pointer
- `(int, int)`: spre o funcție care primește doi int
- `int` din față: și întoarce un int

Parantezele din jurul lui `*op` contează. Fără ele, `int *op(int, int)` ar fi o funcție care întoarce un pointer la int, cu totul altceva

Numele unei funcții, scris fără paranteze, e adresa ei. De aceea merge `op = inmulteste`, iar `op(6, 7)` apelează funcția spre care arată op acum

---

Adevărata putere: putem da o funcție altei funcții. Funcția care o primește nu trebuie să știe ce funcție a primit. Doar o apelează

```c
#include <stdio.h>

int dublu(int x) {
    return x * 2;
}

int patrat(int x) {
    return x * x;
}

void aplica(int v[], int n, int (*f)(int)) {
    for (int i = 0; i < n; i++) {
        v[i] = f(v[i]);
    }
}

int main(void) {
    int v[] = { 1, 2, 3, 4 };
    aplica(v, 4, dublu);
    aplica(v, 4, patrat);
    for (int i = 0; i < 4; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
    return 0;
}
```

Ieșire

```text
4 16 36 64
```

aplica parcurge array-ul o dată, iar noi hotărâm ce se întâmplă cu fiecare valoare. O funcție dată așa se numește **callback**: aplica o cheamă înapoi pentru fiecare valoare

---

Tipul e lung de scris iar și iar. typedef îi dă un nume scurt

```c
#include <stdio.h>

int aduna(int a, int b) {
    return a + b;
}

int inmulteste(int a, int b) {
    return a * b;
}

typedef int (*operatie)(int, int);

int main(void) {
    operatie operatii[] = { aduna, inmulteste };
    printf("%d\n", operatii[1](6, 7));
    return 0;
}
```

Ieșire

```text
42
```

Acum `operatie` e un tip, ca int. Aici am făcut chiar un array de pointeri la funcții: `operatii[1](6, 7)` o apelează pe inmulteste. Tabele ca acesta lasă un program să aleagă o funcție după un număr, fără un lanț lung de if/else

---

## Misiune: Filtrul de bandă

De la senzori vine o bandă lungă de citiri. Tehnicienii tot pun întrebări diferite despre ea: câte citiri sunt pare, câte sunt peste zero, câte sunt mai mari decât 100. În loc să scrii o buclă nouă pentru fiecare întrebare, scrie o singură buclă care primește întrebarea ca funcție

1. Scrie **int numara_daca(int v[], int n, int (\*test)(int))** care întoarce câte valori fac funcția test să întoarcă altceva decât 0
2. Scrie trei funcții mici de test: **e_par**, **e_pozitiv** și **e_mare** (mai mare decât 100). Fiecare primește un int și întoarce 1 sau 0
3. Citește un număr întreg n, apoi n citiri
4. Afișează cele trei numărători, ca în exemplu, fiecare găsită apelând numara_daca cu alt test

n e între 1 și 1000, iar fiecare citire e între -1000 și 1000

**Exemplu**

Intrare

```text
6
4 -3 150 0 101 -8
```

Ieșire

```text
Pare: 4
Pozitive: 3
Mari: 2
```

Zero e par, dar nu e pozitiv
