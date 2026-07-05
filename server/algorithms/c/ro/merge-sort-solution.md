```c
#include <stdio.h>

// Interclaseaza doua sub-tablouri sortate: [stanga..mijloc] si [mijloc+1..dreapta].
// Copiem cele doua parti in tablouri temporare, apoi le imbinam inapoi in vector
// alegand mereu elementul mai mic din capetele lor.
void interclaseaza(int vector[], int stanga, int mijloc, int dreapta) {
    int n1 = mijloc - stanga + 1;
    int n2 = dreapta - mijloc;
    int stang[1000];
    int dreapt[1000];

    for (int i = 0; i < n1; i++) {
        stang[i] = vector[stanga + i];
    }
    for (int j = 0; j < n2; j++) {
        dreapt[j] = vector[mijloc + 1 + j];
    }

    int i = 0;
    int j = 0;
    int k = stanga;
    while (i < n1 && j < n2) {
        if (stang[i] <= dreapt[j]) {
            vector[k] = stang[i];
            i++;
        } else {
            vector[k] = dreapt[j];
            j++;
        }
        k++;
    }
    // Copiem elementele ramase (una din cele doua bucle o sa fie goala).
    while (i < n1) {
        vector[k] = stang[i];
        i++;
        k++;
    }
    while (j < n2) {
        vector[k] = dreapt[j];
        j++;
        k++;
    }
}

// Impartim intervalul in doua, sortam recursiv fiecare parte, apoi le imbinam.
void sorteazaInterclasare(int vector[], int stanga, int dreapta) {
    if (stanga < dreapta) {
        int mijloc = stanga + (dreapta - stanga) / 2;
        sorteazaInterclasare(vector, stanga, mijloc);
        sorteazaInterclasare(vector, mijloc + 1, dreapta);
        interclaseaza(vector, stanga, mijloc, dreapta);
    }
}

int main(void) {
    int n;
    scanf("%d", &n);

    int vector[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &vector[i]);
    }

    sorteazaInterclasare(vector, 0, n - 1);

    for (int i = 0; i < n; i++) {
        printf("%d", vector[i]);
        if (i < n - 1) {
            printf(" ");
        }
    }
    printf("\n");

    return 0;
}
```
