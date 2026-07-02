Pentru numere cu **zecimale** (precum **3.14** sau **1.75**), **int** nu este suficient. C are două tipuri pentru numere zecimale: **float** și **double**

```c
#include <stdio.h>

int main(void) {
    float pi = 3.14f;
    double pret = 9.99;

    printf("%f\n", pi);
    printf("%f\n", pret);

    return 0;
}
```

Output

```text
3.140000
9.990000
```

Doi noi format specifier-i

- **%f** → pentru un **float** sau **double**
- (vei vedea și **%lf** în unele cărți de C, mai ales pentru **scanf**, nu pentru **printf**. **%f** funcționează bine pentru ambele cu **printf**)

În mod implicit, **%f** afișează **6 zecimale**. Dacă vrem mai puține, putem spune lui **printf** câte cifre vrem

```c
#include <stdio.h>

int main(void) {
    double pi = 3.14159;
    printf("%.2f\n", pi);
    printf("%.4f\n", pi);
    return 0;
}
```

Output

```text
3.14
3.1416
```

**.2** și **.4** dintre **%** și **f** înseamnă "atâtea zecimale". Un mic truc care face output-ul mult mai curat

---

Care este diferența dintre **float** și **double**?

- **float** folosește mai puțină memorie dar reține **mai puține** cifre corecte
- **double** folosește mai multă memorie dar reține valori **mai precise**

În practică, **folosește double** dacă nu ai un motiv puternic să nu o faci. **double** este tipul implicit pentru numerele zecimale în C

Observă **f**-ul de la finalul lui **3.14f** din exemplul cu float. Asta îi spune lui C "tratează asta ca pe un float, nu ca pe un double". Fără **f**, valoarea **3.14** ar fi un double. Pentru variabilele **double**, nu ai nevoie de niciun sufix

---

Acum, faimoasa capcană din lecția anterioară, rezolvată

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    double rezultat = a / b;
    printf("%f\n", rezultat);
    return 0;
}
```

Te-ai aștepta la **3.5**. Dar output-ul este **3.000000**. De ce?

Pentru că **a / b** este calculat **primul**, cu ambii **a** și **b** fiind int-i. Rezultatul este **3** (împărțire de întregi). Abia **după** asta, **3** este stocat în **rezultat** ca **3.0**. Până în acel moment, **.5** este deja pierdut pentru totdeauna

Ca să obținem răspunsul real, **cel puțin unul** dintre operanzi trebuie să fie un zecimal

```c
#include <stdio.h>

int main(void) {
    double a = 7;
    int b = 2;
    printf("%f\n", a / b);
    return 0;
}
```

Sau putem folosi un **cast** ca să forțăm unul dintre ei să fie double

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    printf("%f\n", (double) a / b);
    return 0;
}
```

**(double)** în fața lui **a** spune "tratează asta ca pe un double pentru această operație". Asta se numește un **cast**, și este un instrument pe care îl vei folosi des în C

---

## Misiune: Jurnalul camerei calculatoarelor

Camera calculatoarelor centrului de calcul are un termometru și un higrometru conectate la un teleimprimator. Fiecare tură, operatorul citește cele două valori și le notează în jurnal, rotunjite la 2 zecimale.

- Citește două numere reale din input, în această ordine: **temperatura** și **umiditate**
- Afișează **temperatura** pe o linie, cu eticheta `Temperatura: `, rotunjită la **2 zecimale**
- Afișează **umiditate** pe linie separată, cu eticheta `Umiditate: `, rotunjită la **2 zecimale**

**Exemplu**

Input

```text
21.6 45.5
```

Output

```text
Temperatura: 21.60
Umiditate: 45.50
```

**Exemplu**

Input

```text
19.25 60.75
```

Output

```text
Temperatura: 19.25
Umiditate: 60.75
```
