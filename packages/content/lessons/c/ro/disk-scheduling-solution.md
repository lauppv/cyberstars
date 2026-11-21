```c
#include <stdio.h>
#include <stdlib.h>

int cap;
int cereri[100];
int n = 0;

void raporteaza(const char *nume, int ordine[]) {
    int pozitie = cap;
    int mutat = 0;
    printf("%s:", nume);
    for (int i = 0; i < n; i++) {
        printf(" %d", ordine[i]);
        mutat = mutat + abs(ordine[i] - pozitie);
        pozitie = ordine[i];
    }
    printf(", mutat %d\n", mutat);
}

int dupa_valoare(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int main(void) {
    scanf("%d", &cap);
    while (n < 100 && scanf("%d", &cereri[n]) == 1) {
        n++;
    }

    raporteaza("FCFS", cereri);

    int sstf[100];
    int gata[100] = { 0 };
    int pozitie = cap;
    for (int k = 0; k < n; k++) {
        int cel_mai_bun = -1;
        for (int i = 0; i < n; i++) {
            if (gata[i]) {
                continue;
            }
            int d = abs(cereri[i] - pozitie);
            int d_cel_mai_bun = cel_mai_bun == -1 ? 0 : abs(cereri[cel_mai_bun] - pozitie);
            if (cel_mai_bun == -1 || d < d_cel_mai_bun || (d == d_cel_mai_bun && cereri[i] < cereri[cel_mai_bun])) {
                cel_mai_bun = i;
            }
        }
        gata[cel_mai_bun] = 1;
        sstf[k] = cereri[cel_mai_bun];
        pozitie = cereri[cel_mai_bun];
    }
    raporteaza("SSTF", sstf);

    int sortate[100];
    for (int i = 0; i < n; i++) {
        sortate[i] = cereri[i];
    }
    qsort(sortate, n, sizeof(int), dupa_valoare);
    int look[100];
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (sortate[i] >= cap) {
            look[k] = sortate[i];
            k++;
        }
    }
    for (int i = n - 1; i >= 0; i--) {
        if (sortate[i] < cap) {
            look[k] = sortate[i];
            k++;
        }
    }
    raporteaza("LOOK", look);
    return 0;
}
```
