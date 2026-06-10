În programare vrem adesea să **stocăm** valori ca să le folosim mai târziu. Cel mai simplu exemplu: numere. În C, înainte de a stoca ceva, trebuie să-i spunem limbajului **ce fel de valoare** stocăm. Asta se numește **tip**

```c
#include <stdio.h>

int main(void) {
    int varsta = 18;
    int x = 1;

    printf("%d\n", varsta);
    printf("%d\n", x);

    return 0;
}
```

Output

```text
18
1
```

**int** este tipul pentru **numere întregi** (1, 2, 100, -20, 0). Lui C îi pasă de tipuri — nu ne va lăsa să stocăm un număr într-o variabilă fără să-i spunem ce fel de număr este

---

Observă noutatea: **%d** din interiorul **printf**-ului. Acesta este un **format specifier**. **printf** nu știe singur cum să afișeze un **int**, trebuie să-i spunem: "uite un int, te rog afișează-l"

- **%d** → pentru un **int**
- **\n** → linie nouă, ca până acum

Format specifier-ul (**%d**) este înlocuit cu valoarea (variabila care vine după virgulă)

Putem amesteca format specifier-i cu text obișnuit

```c
#include <stdio.h>

int main(void) {
    int varsta = 60;
    printf("Varsta mea este %d\n", varsta);
    return 0;
}
```

Output

```text
Varsta mea este 60
```

Putem folosi mai mulți specifier-i pe o singură linie

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 20;
    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

Output

```text
a = 10, b = 20
```

Primul **%d** este înlocuit cu **a**, al doilea cu **b**, în ordine

---

Putem face calcule, exact ca în orice alt limbaj

```c
#include <stdio.h>

int main(void) {
    int a = 2;
    int b = 6;
    int c = a + b;
    printf("%d\n", c);
    return 0;
}
```

Afișează **8**. Aceeași regulă: **partea dreaptă** a lui **=** este calculată prima, apoi stocată în stânga

Clasica **incrementare cu 1** are și o scurtătură în C

```c
#include <stdio.h>

int main(void) {
    int n = 10;
    n++;
    printf("%d\n", n);
    return 0;
}
```

Afișează **11**. **n++** este același lucru cu **n = n + 1**

---

O mică surpriză. Încearcă asta

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    printf("%d\n", a / b);
    return 0;
}
```

Afișează **3**, nu **3.5**. De ce? Pentru că **a / b** cu doi int-i dă înapoi un **int** — C aruncă partea zecimală. Vom vedea cum să păstrăm zecimalele în lecția următoare, cu **float**

---

## Misiune: Registrul Echipajului

Baza de date a echipajului stației are nevoie ca două înregistrări să fie afișate în consolă: vârsta unui membru al echipajului și nivelul lui de acces.

Folosind variabilele `varsta` și `x` deja declarate în dreapta, scrie **două apeluri printf** care afișează fiecare valoare cu o etichetă.

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `varsta` — vârsta membrului echipajului
- `x` — nivelul de acces

**Exemplu**

Cu `varsta = 60` și `x = 5`, programul tău ar trebui să afișeze

```text
Varsta mea este 60
x este 5
```
