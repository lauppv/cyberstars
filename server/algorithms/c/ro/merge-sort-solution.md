```c
#include <stdio.h>

void interclaseaza(int vector[], int stanga, int mijloc, int dreapta) {
    int n1 = mijloc - stanga + 1;
    int n2 = dreapta - mijloc;
    int stang[1000], dreapt[1000];

    for (int i = 0; i < n1; i++) {
        stang[i] = vector[stanga + i];
    }
    for (int j = 0; j < n2; j++) {
        dreapt[j] = vector[mijloc + 1 + j];
    }

    int i = 0, j = 0, k = stanga;
    while (i < n1 && j < n2) {
        if (stang[i] <= dreapt[j]) {
            vector[k++] = stang[i++];
        } else {
            vector[k++] = dreapt[j++];
        }
    }
    while (i < n1) {
        vector[k++] = stang[i++];
    }
    while (j < n2) {
        vector[k++] = dreapt[j++];
    }
}

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
