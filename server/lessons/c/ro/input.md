Până acum, toate valorile din programele noastre au fost hardcodate. E timpul să-l lăsăm pe **utilizator** să tasteze ceva. În C, citim input cu **scanf**

```c
#include <stdio.h>

int main(void) {
    int varsta;

    printf("Varsta ta: ");
    scanf("%d", &varsta);

    printf("Anul viitor vei avea %d\n", varsta + 1);
    return 0;
}
```

**Rulează** programul, tastează un număr, apasă **Enter**

Două lucruri de observat

- **scanf** este partenerul lui **printf**: în loc să scrie output, citește input
- Primul argument este un **format specifier**, exact ca în **printf**. **%d** pentru un int, **%f** pentru un float/double, **%s** pentru un șir, **%c** pentru un singur char
- Al doilea argument este **&varsta** cu un **&** ciudat în față

---

De ce **&**-ul? În C, **&variabila** înseamnă "**adresa** acestei variabile". Când apelăm **scanf**, îi spunem: "uite unde în memorie ar trebui să scrii valoarea pe care o tastează utilizatorul". Fără **&**, **scanf** ar primi o copie a valorii variabilei (ceea ce nu are sens înainte de citire), iar programul tău ar putea să crape sau să corupă memoria în liniște

Nu-ți face prea multe griji deocamdată. Regula este simplă

- **printf** folosește doar variabila
- **scanf** folosește **&variabila** (aproape întotdeauna)

Există o excepție: când citești un șir (un **char[]**), nu folosești **&**. Vom acoperi asta în lecția despre string-uri

---

Pentru a citi un **double**

```c
#include <stdio.h>

int main(void) {
    double inaltime;
    scanf("%lf", &inaltime);
    printf("%f\n", inaltime);
    return 0;
}
```

**Important**: pentru **scanf**, double-urile folosesc **%lf** (l de la "long", f de la "float"), nu **%f**. **%f** în **scanf** ar citi un **float** obișnuit în schimb. Acesta este un mic **capriciu al C-ului** care îi prinde pe mulți începători. (Pentru **printf**, atât **%f** cât și **%lf** funcționează la fel pe double-uri. Inconsistent? Da)

---

Citirea mai multor valori într-un singur apel **scanf**

```c
#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Suma: %d\n", a + b);
    return 0;
}
```

Utilizatorul tastează două numere separate prin spațiu (sau Enter), **scanf** le citește pe amândouă. Observă că tot folosim **&** în fața fiecărei variabile

---

Dar ce facem dacă vrem să citim o **linie întreagă** cu spații? **scanf("%s")** se oprește la primul spațiu, deci dacă utilizatorul tastează **Dennis Ritchie**, scanf citește doar **Dennis**. Pentru linii întregi, folosim **fgets**

```c
#include <stdio.h>

int main(void) {
    char nume[64];

    printf("Numele complet: ");
    fgets(nume, sizeof(nume), stdin);

    printf("Salut %s", nume);
    return 0;
}
```

**fgets** primește trei argumente:

- **nume** — unde să stocheze textul
- **sizeof(nume)** — numărul maxim de caractere de citit (previne un buffer overflow!)
- **stdin** — citește de la standard input (tastatura)

Spre deosebire de **scanf**, **fgets** este **sigur** — nu va scrie niciodată mai multe caractere decât poate ține buffer-ul. De aceea **fgets** este preferat față de **scanf** pentru citirea string-urilor în programele C reale

O mică capcană: **fgets** păstrează caracterul de **linie nouă** (**\n**) la final. Ca să-l eliminăm

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char nume[64];

    printf("Numele complet: ");
    fgets(nume, sizeof(nume), stdin);
    nume[strcspn(nume, "\n")] = '\0';

    printf("Salut %s!\n", nume);
    return 0;
}
```

**strcspn(nume, "\n")** găsește poziția liniei noi, iar noi o înlocuim cu **\0** (terminatorul de șir). Este un pattern C comun pe care îl vei vedea peste tot

---

## Misiune: Registrul de acces al centrului de calcul

Fiecare operator care ajunge la centrul de calcul trebuie să se înregistreze la terminalul de la intrare. Sistemul îi citește **numele** și **vârsta**, apoi afișează un mesaj de bun venit cu vârsta lui de anul viitor.

Citește un nume (un singur cuvânt, fără spații) și o vârstă folosind **scanf**, apoi afișează linia de bun venit.

**Exemplu**

Input

```text
Ritchie
60
```

Output

```text
Salut Ritchie, ai 60 de ani. Anul viitor vei avea 61
```

**Exemplu**

Input

```text
Thompson
33
```

Output

```text
Salut Thompson, ai 33 de ani. Anul viitor vei avea 34
```
