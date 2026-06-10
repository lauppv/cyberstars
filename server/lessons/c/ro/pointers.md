Aceasta este lecția care separă C de aproape orice alt limbaj. **Pointerii**. Sună înfricoșător, dar odată ce înțelegi ideea, sunt de fapt destul de eleganți

Un **pointer** este o variabilă care stochează **adresa** altei variabile. Gândește-te așa: fiecare variabilă trăiește undeva în memorie, la o **adresă** specifică. Un pointer este o bucată de hârtie pe care ai notat acea adresă

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
    int *p = &x;    // p pointează către x

    printf("%d\n", *p);   // 10 — valoarea de la adresa pe care o ține p
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
    printf("%d\n", x);   // 42 — x s-a schimbat!
    return 0;
}
```

Nu am atins **x** direct. Am trecut prin **p**, am urmat adresa, și am schimbat valoarea de acolo. Pentru că **p** pointează către **x**, schimbând **\*p** schimbăm **x**. Aceasta este puterea pointerilor

---

O analogie utilă: gândește-te la un **pin de Google Maps**. Pin-ul nu este restaurantul — este o **referință către** restaurant. Dacă împărtășești pin-ul cu cineva și acea persoană merge acolo și revopsește clădirea, restaurantul s-a schimbat, chiar dacă tu nu ai mers acolo personal. Asta face un pointer

---

Tipuri diferite de pointeri pentru tipuri diferite:

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int *ip = &a;       // pointer către int

    double b = 3.14;
    double *dp = &b;    // pointer către double

    char c = 'A';
    char *cp = &c;      // pointer către char

    printf("%d %f %c\n", *ip, *dp, *cp);
    return 0;
}
```

Tipul pointerului trebuie să se potrivească cu tipul către care pointează. Un **int \*** poate pointa doar către un **int**. Așa știe C câți bytes să citească atunci când dereferențiezi

---

## Misiune: Suprascrierea Valvei de la Distanță

O valvă de presiune de pe Puntea 7 este blocată. Nu o poți atinge fizic, dar ai un pointer către registrul ei de control. Folosește pointerul ca să schimbi setarea valvei de la distanță.

1. Declară o variabilă **int** **x** cu valoarea **7**
2. Creează un pointer **ptr** care pointează către **x**
3. Folosește pointerul ca să schimbi **x** în **42** (atribuie prin **\*ptr**)
4. Afișează atât **x** cât și **\*ptr**

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `x` — un int cu valoarea inițială **7**

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
42
42
```
