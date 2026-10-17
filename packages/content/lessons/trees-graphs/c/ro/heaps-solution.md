```c
#include <stdio.h>

void heap_adauga(int heap[], int *marime, int valoare) {
    heap[*marime] = valoare;
    int i = *marime;
    *marime = *marime + 1;
    while (i > 0) {
        int parinte = (i - 1) / 2;
        if (heap[i] < heap[parinte]) {
            int temp = heap[i];
            heap[i] = heap[parinte];
            heap[parinte] = temp;
            i = parinte;
        } else {
            break;
        }
    }
}

int heap_extrage(int heap[], int *marime) {
    int minim = heap[0];
    *marime = *marime - 1;
    heap[0] = heap[*marime];
    int i = 0;
    while (1) {
        int stanga = 2 * i + 1;
        int dreapta = 2 * i + 2;
        int copil = i;
        if (stanga < *marime && heap[stanga] < heap[copil]) {
            copil = stanga;
        }
        if (dreapta < *marime && heap[dreapta] < heap[copil]) {
            copil = dreapta;
        }
        if (copil == i) {
            break;
        }
        int temp = heap[i];
        heap[i] = heap[copil];
        heap[copil] = temp;
        i = copil;
    }
    return minim;
}

void afiseaza_heap(const char *eticheta, int heap[], int marime) {
    printf("%s", eticheta);
    for (int i = 0; i < marime; i++) {
        printf(" %d", heap[i]);
    }
    printf("\n");
}

int main(void) {
    int n;
    scanf("%d", &n);
    int heap[7];
    int marime = 0;
    for (int i = 0; i < n; i++) {
        int valoare;
        scanf("%d", &valoare);
        heap_adauga(heap, &marime, valoare);
    }
    int extrageri;
    scanf("%d", &extrageri);

    afiseaza_heap("Heap:", heap, marime);

    printf("Extrase:");
    for (int i = 0; i < extrageri; i++) {
        printf(" %d", heap_extrage(heap, &marime));
    }
    printf("\n");

    afiseaza_heap("Ramase:", heap, marime);
    return 0;
}
```
