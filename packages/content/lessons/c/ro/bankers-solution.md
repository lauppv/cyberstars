```c
#include <stdio.h>

int n, m;
int disponibil[4];
int max[8][4];
int alocat[8][4];
int nevoie[8][4];

int incape(int a[], int b[]) {
    for (int j = 0; j < m; j++) {
        if (a[j] > b[j]) {
            return 0;
        }
    }
    return 1;
}

int sigur(int ordine[]) {
    int work[4];
    int terminat[8] = { 0 };
    for (int j = 0; j < m; j++) {
        work[j] = disponibil[j];
    }
    for (int pas = 0; pas < n; pas++) {
        int gasit = -1;
        for (int i = 0; i < n && gasit == -1; i++) {
            if (!terminat[i] && incape(nevoie[i], work)) {
                gasit = i;
            }
        }
        if (gasit == -1) {
            return 0;
        }
        for (int j = 0; j < m; j++) {
            work[j] = work[j] + alocat[gasit][j];
        }
        terminat[gasit] = 1;
        ordine[pas] = gasit;
    }
    return 1;
}

void da(int p, int cerere[], int semn) {
    for (int j = 0; j < m; j++) {
        disponibil[j] = disponibil[j] - semn * cerere[j];
        alocat[p][j] = alocat[p][j] + semn * cerere[j];
        nevoie[p][j] = nevoie[p][j] - semn * cerere[j];
    }
}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int j = 0; j < m; j++) {
        scanf("%d", &disponibil[j]);
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            scanf("%d", &max[i][j]);
        }
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            scanf("%d", &alocat[i][j]);
            nevoie[i][j] = max[i][j] - alocat[i][j];
        }
    }

    int ordine[8];
    if (!sigur(ordine)) {
        printf("Nesigur\n");
        return 0;
    }
    printf("Sigur:");
    for (int i = 0; i < n; i++) {
        printf(" P%d", ordine[i]);
    }
    printf("\n");

    int p;
    int cerere[4];
    while (scanf("%d", &p) == 1) {
        for (int j = 0; j < m; j++) {
            scanf("%d", &cerere[j]);
        }
        printf("P%d", p);
        for (int j = 0; j < m; j++) {
            printf(" %d", cerere[j]);
        }

        if (!incape(cerere, nevoie[p])) {
            printf(": eroare\n");
        } else if (!incape(cerere, disponibil)) {
            printf(": asteapta\n");
        } else {
            da(p, cerere, 1);
            if (sigur(ordine)) {
                printf(": acceptata\n");
            } else {
                da(p, cerere, -1);
                printf(": nesigur\n");
            }
        }
    }
    return 0;
}
```
