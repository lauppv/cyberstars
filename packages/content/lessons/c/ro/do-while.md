O buclă while verifică întâi condiția. Dacă de la început condiția e falsă, corpul nu rulează deloc, nici măcar o dată

Uneori vrem invers: întâi facem treaba, apoi hotărâm dacă mai facem o tură. Pentru asta, C are **do-while**

```c
#include <stdio.h>

int main(void) {
    int i = 1;
    do {
        printf("Tura %d\n", i);
        i++;
    } while (i <= 3);
    return 0;
}
```

Ieșire

```text
Tura 1
Tura 2
Tura 3
```

Corpul stă între `do {` și `}`. Condiția vine după el, în `while (...)`. Nu uita `;` de la final: do-while e singura buclă din C care are nevoie de el

---

Diferența se vede când condiția e falsă din prima

```c
#include <stdio.h>

int main(void) {
    int n = 10;

    while (n < 5) {
        printf("while: %d\n", n);
    }

    do {
        printf("do-while: %d\n", n);
    } while (n < 5);

    return 0;
}
```

Ieșire

```text
do-while: 10
```

Bucla while întreabă întâi, primește „nu” și sare peste corp. Bucla do-while rulează corpul o dată, apoi întreabă, primește „nu” și se oprește. Un do-while rulează mereu **cel puțin o dată**

---

Când e util? Când valoarea pe care o verificăm există abia după prima tură. Citirea de la input e cazul clasic: nu putem verifica un număr înainte să-l citim

```c
#include <stdio.h>

int main(void) {
    int cod;
    do {
        scanf("%d", &cod);
        printf("Am primit %d\n", cod);
    } while (cod != 0);
    printf("Cititorul s-a oprit\n");
    return 0;
}
```

Intrare

```text
7 3 0
```

Ieșire

```text
Am primit 7
Am primit 3
Am primit 0
Cititorul s-a oprit
```

Cu un while simplu, ne-ar trebui un scanf înainte de buclă și încă unul în ea. Bucla do-while are nevoie de unul singur

---

## Misiune: Numărătorul de cartele

Cititorul de cartele din centrul de calcul citește cartelele perforate una câte una. Fiecare cartelă are un număr de găuri. La finalul teancului, operatorul pune o cartelă goală, cu 0 găuri, ca cititorul să știe când să se oprească. Și cartela goală e tot o cartelă, deci se numără

1. Citește numere întregi de la input cu o buclă do-while: găurile de pe fiecare cartelă. Oprește-te după ce citești 0
2. Numără cartelele, inclusiv pe cea goală, și adună toate găurile
3. Afișează cele două rezultate, ca în exemplu

Teancul se termină mereu cu 0 și are între 1 și 100 de cartele

**Exemplu**

Intrare

```text
12 5 30 0
```

Ieșire

```text
Cartele: 4
Gauri: 47
```

**Exemplu**

Intrare

```text
0
```

Ieșire

```text
Cartele: 1
Gauri: 0
```
