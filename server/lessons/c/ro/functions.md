O **funcție** în C este o bucată de cod pe care o scriem **o singură dată** și o refolosim de **multe ori**

```c
#include <stdio.h>

void saluta(char nume[]) {
    printf("Salut, %s!\n", nume);
}

int main(void) {
    saluta("Ritchie");
    saluta("Thompson");
    saluta("Kernighan");
    return 0;
}
```

Ieșire

```text
Salut, Ritchie!
Salut, Thompson!
Salut, Kernighan!
```

Hai să descompunem antetul funcției

```text
void saluta(char nume[])
```

- **void** — funcția **NU** întoarce nimic (doar afișează)
- **saluta** — numele funcției
- **(char nume[])** — lista de parametri. **char nume[]** înseamnă "un șir de caractere" (o bucată de text). Vom discuta despre string-uri într-o lecție dedicată

Format specifier-ul **%s** din **printf** este pentru string-uri, exact cum **%d** este pentru int-i

---

O funcție poate, de asemenea, să **întoarcă** o valoare. În loc de **void**, punem tipul de retur

```c
#include <stdio.h>

int aduna(int a, int b) {
    return a + b;
}

int main(void) {
    int rezultat = aduna(2, 3);
    printf("%d\n", rezultat);
    return 0;
}
```

Output **5**

Funcția **aduna** primește doi int-i și întoarce un int. Cuvântul cheie **return** trimite valoarea înapoi, și **funcția iese imediat** când **return** rulează

Putem folosi rezultatul și direct într-o altă expresie

```c
#include <stdio.h>

int aduna(int a, int b) {
    return a + b;
}

int main(void) {
    printf("%d\n", aduna(2, 3) * 10);   // 50
    return 0;
}
```

---

**Detaliu important în C**: o funcție trebuie să fie **declarată înainte de a fi folosită**. De aceea **aduna** este scrisă **deasupra** lui **main**. Dacă o punem dedesubt, compilatorul citește **main** primul, vede **aduna** apelată, nu știe ce este **aduna** și se plânge

```c
#include <stdio.h>

int main(void) {
    int x = aduna(2, 3);   // EROARE: aduna nu este inca cunoscuta
    return 0;
}

int aduna(int a, int b) {   // declarata prea tarziu
    return a + b;
}
```

Există o soluție: **declarații anticipate** (numite și **prototipuri**). Scriem antetul funcției la început, corpul oriunde

```c
#include <stdio.h>

int aduna(int a, int b);   // prototip

int main(void) {
    printf("%d\n", aduna(2, 3));
    return 0;
}

int aduna(int a, int b) {   // corpul, scris mai tarziu
    return a + b;
}
```

Observă **;**-ul de la finalul prototipului — este o declarație, nu un corp. Deocamdată, cel mai simplu este să-ți scrii funcțiile ajutătoare **deasupra** lui **main** și să nu-ți mai faci griji

---

## Misiune: Modulul aritmetic al terminalului

Într-un centru de calcul de altădată, fiecare terminal avea nevoie de propriul modul de aritmetică rapidă, ca operatorii să nu mai facă aceleași calcule de mână de fiecare dată.

Scrie o funcție **calculator** care primește trei parametri: **int numar1**, **int numar2** și **char operator** (un singur caracter precum **'+'**, **'-'**, **'\*'**, **'/'** — observă **ghilimelele simple** pentru un singur char în C).

Funcția ar trebui să afișeze rezultatul operației, în formatul **numar1 operator numar2 = rezultat**. Dacă operatorul nu este recunoscut, afișează **Operator invalid**.

1. Tratează **adunarea** (**'+'**), **scăderea** (**'-'**), **înmulțirea** (**'\*'**) și **împărțirea** (**'/'**)
2. Folosește **%c** ca format specifier pentru un singur **char**
3. Folosește **==** ca să compari char-ul (asta funcționează în C pentru că char-urile sunt, sub capotă, întregi mici)

În **main**, apelează **calculator** de cinci ori, cu exact aceste seturi de argumente, în ordine:

- **14, 12, '+'**
- **10, 3, '-'**
- **5, 4, '\*'**
- **10, 2, '/'**
- **1, 1, 'x'**

**Exemplu**

Programul tău ar trebui să afișeze

```text
14 + 12 = 26
10 - 3 = 7
5 * 4 = 20
10 / 2 = 5
Operator invalid
```
