Iată un secret: în C, **tablourile și pointerii sunt strâns legați**. Când folosești numele unui tablou de unul singur, el **decade** într-un pointer către primul element

```c
#include <stdio.h>

int main(void) {
    int numere[] = {10, 20, 30, 40, 50};
    int *p = numere;   // fara & — numere ESTE deja o adresa

    printf("%d\n", *p);        // 10 — primul element
    printf("%d\n", *(p + 1));  // 20 — al doilea element
    printf("%d\n", *(p + 2));  // 30 — al treilea element
    return 0;
}
```

**numere** este în esență un pointer către primul element. **p + 1** nu adaugă 1 byte — se mută la **următorul int** (4 bytes înainte). Aceasta se numește **aritmetică de pointeri**, și C se ocupă automat de mărime în funcție de tip

---

Asta înseamnă că **tablou[i]** este doar zahăr sintactic pentru **\*(tablou + i)**. Sunt literalmente același lucru

```c
#include <stdio.h>

int main(void) {
    int numere[] = {10, 20, 30};
    printf("%d\n", numere[1]);       // 20
    printf("%d\n", *(numere + 1));   // 20 — acelasi lucru!
    return 0;
}
```

De aceea indicii tablourilor încep de la **0** în C. Primul element este la offset-ul **0** de la început: **\*(tablou + 0)** este **\*tablou** este **tablou[0]**

---

Putem și **parcurge** un tablou cu un pointer

```c
#include <stdio.h>

int main(void) {
    int numere[] = {10, 20, 30, 40, 50};
    int n = 5;

    int *p = numere;
    for (int i = 0; i < n; i++) {
        printf("%d\n", *p);
        p++;   // mergi la urmatorul element
    }
    return 0;
}
```

**p++** avansează pointerul cu un element (un int înainte). Este echivalent cu bucla clasică **numere[i]** dar îți arată ce se întâmplă sub capotă

---

Îți amintești când am spus că transmiterea unui tablou către o funcție face **sizeof** să nu mai funcționeze? Acum înțelegi **de ce**. Când scrii

```c
void afiseaza(int tablou[]) { }
```

compilatorul vede de fapt

```c
void afiseaza(int *tablou) { }
```

Tabloul **decade** într-un pointer. Funcția primește doar adresa primului element — **nu are nicio idee** cât de mare este tabloul. De aceea transmitem mereu **mărimea** ca parametru separat

---

## Misiune: Sumatorul buffer-ului de bandă

Un buffer brut de memorie a fost citit de pe bandă magnetică: mai întâi mărimea lui, apoi valorile propriu-zise. Scrie o funcție care parcurge buffer-ul folosind **aritmetica de pointeri** și returnează suma tuturor valorilor.

1. Citește un întreg **n**, apoi **n** numere întregi, într-un tablou **numere**
2. Scrie o funcție **suma_tablou** care primește un **pointer la int** și o **mărime**, și returnează **suma** tuturor elementelor
3. Folosește **aritmetică de pointeri** în interiorul funcției: accesează elementele cu **\*(ptr + i)** în loc de **ptr[i]**
4. În **main**, apelează **suma_tablou** și afișează rezultatul

**Exemplu**

Input

```text
4
5 10 15 20
```

Output

```text
50
```

**Exemplu**

Input

```text
3
1 2 3
```

Output

```text
6
```
