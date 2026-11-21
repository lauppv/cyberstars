Un array ține un rând de valori. Unele date vin însă ca un tabel, cu rânduri și coloane: planul unei săli, o tablă de șah, becurile de pe un panou. Pentru asta, C ne lasă să facem un **array de array-uri**, un array 2D

```c
#include <stdio.h>

int main(void) {
    int grila[2][3] = {
        { 1, 2, 3 },
        { 4, 5, 6 }
    };
    printf("%d\n", grila[0][2]);
    printf("%d\n", grila[1][0]);
    return 0;
}
```

Ieșire

```text
3
4
```

`int grila[2][3]` înseamnă 2 rânduri, cu câte 3 valori pe fiecare rând. Primul indice alege rândul, al doilea alege coloana. Amândoi încep de la 0, ca de obicei: grila[0][2] e rândul 0, coloana 2

---

Ca să parcurgem un tabel întreg, folosim buclele imbricate din lecția trecută. Bucla din afară trece prin rânduri, bucla din interior trece prin coloanele acelui rând

```c
#include <stdio.h>

int main(void) {
    int grila[2][3] = {
        { 1, 2, 3 },
        { 4, 5, 6 }
    };
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            printf("%d ", grila[r][c]);
        }
        printf("\n");
    }
    return 0;
}
```

Ieșire

```text
1 2 3
4 5 6
```

---

Citirea unui tabel de la input merge la fel, cu scanf în bucla din interior. Mărimea trebuie fixată când scriem codul, așa că facem array-ul destul de mare pentru cel mai mare tabel și folosim doar o parte din el

```c
#include <stdio.h>

int main(void) {
    int randuri, coloane;
    int grila[10][10];
    scanf("%d %d", &randuri, &coloane);
    for (int r = 0; r < randuri; r++) {
        for (int c = 0; c < coloane; c++) {
            scanf("%d", &grila[r][c]);
        }
    }

    for (int r = 0; r < randuri; r++) {
        int suma = 0;
        for (int c = 0; c < coloane; c++) {
            suma = suma + grila[r][c];
        }
        printf("Randul %d: %d\n", r, suma);
    }
    return 0;
}
```

Intrare

```text
2 3
1 2 3
4 5 6
```

Ieșire

```text
Randul 0: 6
Randul 1: 15
```

---

Ca să mergem în jos pe o coloană în loc de un rând, schimbăm buclele între ele: ținem coloana fixă și trecem prin rânduri

---

Un array 2D poate fi trimis și unei funcții. C trebuie să știe cât de lung e fiecare rând, așa că a doua mărime trebuie scrisă în parametru. Prima poate rămâne goală

```c
#include <stdio.h>

int suma_coloana(int grila[][3], int randuri, int col) {
    int suma = 0;
    for (int r = 0; r < randuri; r++) {
        suma = suma + grila[r][col];
    }
    return suma;
}

int main(void) {
    int grila[2][3] = {
        { 1, 2, 3 },
        { 4, 5, 6 }
    };
    printf("%d\n", suma_coloana(grila, 2, 1));
    return 0;
}
```

Ieșire

```text
7
```

De ce are nevoie C de lungimea rândului? În memorie, rândurile stau unul după altul, pe o singură linie: 1 2 3 4 5 6. Ca să găsească grila[1][0], C sare peste un rând întreg, iar pentru asta trebuie să știe câte valori are un rând

---

## Misiune: Planul de memorie cu inele

Calculatoarele vechi își țineau memoria într-un plan cu inele magnetice mici, numite ferite, așezate pe rânduri și coloane. Fiecare inel ține un 1 sau un 0. Un tehnician testează un plan și vrea să știe cât de plin e fiecare rând și care coloană are cei mai mulți de 1

1. Citește numărul de rânduri și numărul de coloane, apoi planul, câte un rând pe linie. Ține-l într-un array 2D
2. Afișează câți de 1 are fiecare rând. Numerotează rândurile de la 1, ca în exemplu
3. Scrie o funcție **int numara_coloana(int plan[][10], int randuri, int col)** care întoarce câți de 1 are coloana col
4. Folosește-o ca să găsești coloana cu cei mai mulți de 1 și afișează-i numărul, tot numărând de la 1. Când două coloane au același număr, alege-o pe cea mai din stânga

Planul are între 1 și 10 rânduri și între 1 și 10 coloane

**Exemplu**

Intrare

```text
3 4
1 0 1 1
0 0 1 0
1 1 1 0
```

Ieșire

```text
Randul 1: 3
Randul 2: 1
Randul 3: 3
Cea mai plina coloana: 3
```

**Exemplu**

Intrare

```text
2 2
0 0
0 0
```

Ieșire

```text
Randul 1: 0
Randul 2: 0
Cea mai plina coloana: 1
```
