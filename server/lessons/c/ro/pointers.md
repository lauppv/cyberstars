Aceasta este lecția care separă C de aproape orice alt limbaj. **Pointerii**. Sună înfricoșător, dar odată ce înțelegi ideea, sunt de fapt destul de eleganți

Un **pointer** este o variabilă care stochează **adresa** altei variabile. Gândește-te așa: fiecare variabilă trăiește undeva în memoria calculatorului, la o **adresă** specifică — un număr, exact ca un număr de cameră într-un imobil de birouri. Un pointer este o bucată de hârtie pe care ai notat acel număr de cameră

```c
#include <stdio.h>

int main(void) {
    int varsta = 25;
    int *ptr = &varsta;

    printf("Valoarea lui varsta: %d\n", varsta);
    printf("Adresa lui varsta: %p\n", (void *)&varsta);
    printf("Valoarea lui ptr: %p\n", (void *)ptr);
    printf("Valoarea de la ptr: %d\n", *ptr);
    return 0;
}
```

Doi operatori noi:

- **&** — operatorul **adresa-lui**. **&varsta** ne dă **adresa** la care este stocat `varsta` în memorie
- **\*** — operatorul de **dereferențiere**. **\*ptr** ne dă **valoarea** de la adresa stocată în `ptr`

Deci **&varsta** dă adresa, **\*ptr** citește valoarea de la acea adresă. Sunt ca inverșii unul altuia

---

Declarația **int \*ptr** spune "ptr este un pointer către un int". **\*** de aici este parte din **tip**, nu operatorul de dereferențiere. La început e confuz, dar te obișnuiești

```c
#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;    // p pointeaza catre x

    printf("%d\n", *p);   // 10 - valoarea de la adresa pe care o tine p
    return 0;
}
```

Putem și **schimba** valoarea prin pointer

```c
#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;
    *p = 42;
    printf("%d\n", x);   // 42 - x s-a schimbat!
    return 0;
}
```

Hai să urmărim ce se întâmplă:

1. **x** e creat cu valoarea 10, undeva în memorie
2. **p** este un pointer care primește adresa lui **x** — acum **p** "știe" unde locuiește **x**
3. **\*p = 42** nu schimbă pointerul, ci merge la adresa din **p** și scrie 42 acolo
4. cum **p** ținea adresa lui **x**, valoarea scrisă acolo este chiar **x**

Nu am atins **x** direct. Am trecut prin **p**, am urmat adresa, și am schimbat valoarea de acolo. Aceasta este puterea pointerilor

---

Pe primele sisteme UNIX de la Bell Labs, programatorii lucrau cu memoria exact la acest nivel: fiecare octet avea o adresă, iar un pointer greșit putea scrie peste memoria altui program. Din acest motiv, C te lasă foarte aproape de mașină — și de aceea trebuie să fii atent la ce pointer citești și ce pointer scrii

---

Tipuri diferite de pointeri pentru tipuri diferite:

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int *ip = &a;       // pointer catre int

    double b = 3.14;
    double *dp = &b;    // pointer catre double

    char c = 'A';
    char *cp = &c;       // pointer catre char

    printf("%d %f %c\n", *ip, *dp, *cp);
    return 0;
}
```

Tipul pointerului trebuie să se potrivească cu tipul către care pointează. Un **int \*** poate pointa doar către un **int**. Așa știe C câți octeți să citească atunci când dereferențiezi

---

## Misiune: Registrul de control al bandă magnetică

Ești operator de tură la centrul de calcul. Un cititor de bandă magnetică ți-a transmis o valoare inițială pentru registrul său de control, dar comanda nouă trebuie scrisă prin pointer — accesul direct la hardware nu e permis, doar prin adresă.

1. Citește un **int** **x** din input
2. Creează un pointer **ptr** care pointează către **x**
3. Folosește pointerul ca să schimbi **x** în **42** (atribuie prin **\*ptr**)
4. Afișează atât **x** cât și **\*ptr**, fiecare pe linia lui

**Exemplu**

Input

```text
7
```

Output

```text
42
42
```

**Exemplu**

Input

```text
100
```

Output

```text
42
42
```

Indiferent ce valoare are **x** la citire, după ce scrii prin pointer, **x** devine **42**.
