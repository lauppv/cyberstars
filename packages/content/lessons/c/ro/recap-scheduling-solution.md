```c
#include <stdio.h>

int n, q;
char nume[20][8];
int sosire[20], executie[20];

int mai_devreme(int a, int b) {
    return sosire[a] < sosire[b];
}

int urmatoarea_sosire(int luat[]) {
    int urmator = -1;
    for (int i = 0; i < n; i++) {
        if (!luat[i] && (urmator == -1 || mai_devreme(i, urmator))) {
            urmator = i;
        }
    }
    return urmator;
}

int fcfs(void) {
    int luat[20] = { 0 };
    int ceas = 0;
    int total = 0;
    for (int k = 0; k < n; k++) {
        int p = urmatoarea_sosire(luat);
        luat[p] = 1;
        if (ceas < sosire[p]) {
            ceas = sosire[p];
        }
        total = total + ceas - sosire[p];
        ceas = ceas + executie[p];
    }
    return total;
}

int sjf(void) {
    int gata[20] = { 0 };
    int ceas = 0;
    int total = 0;
    int terminate = 0;
    while (terminate < n) {
        int ales = -1;
        for (int i = 0; i < n; i++) {
            if (gata[i] || sosire[i] > ceas) {
                continue;
            }
            if (ales == -1 || executie[i] < executie[ales] ||
                (executie[i] == executie[ales] && mai_devreme(i, ales))) {
                ales = i;
            }
        }
        if (ales == -1) {
            ceas = sosire[urmatoarea_sosire(gata)];
            continue;
        }
        total = total + ceas - sosire[ales];
        ceas = ceas + executie[ales];
        gata[ales] = 1;
        terminate++;
    }
    return total;
}

int round_robin(void) {
    int adaugat[20] = { 0 };
    int ramas[20];
    int coada[2000];
    int inceput = 0, sfarsit = 0;
    int ceas = 0;
    int total = 0;
    int terminate = 0;
    for (int i = 0; i < n; i++) {
        ramas[i] = executie[i];
    }

    while (terminate < n) {
        int p;
        while ((p = urmatoarea_sosire(adaugat)) != -1 && sosire[p] <= ceas) {
            adaugat[p] = 1;
            coada[sfarsit] = p;
            sfarsit++;
        }
        if (inceput == sfarsit) {
            ceas = sosire[urmatoarea_sosire(adaugat)];
            continue;
        }
        p = coada[inceput];
        inceput++;
        int felie = ramas[p] < q ? ramas[p] : q;
        ceas = ceas + felie;
        ramas[p] = ramas[p] - felie;

        int a;
        while ((a = urmatoarea_sosire(adaugat)) != -1 && sosire[a] <= ceas) {
            adaugat[a] = 1;
            coada[sfarsit] = a;
            sfarsit++;
        }
        if (ramas[p] > 0) {
            coada[sfarsit] = p;
            sfarsit++;
        } else {
            total = total + ceas - sosire[p] - executie[p];
            terminate++;
        }
    }
    return total;
}

int main(void) {
    scanf("%d %d", &n, &q);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", nume[i], &sosire[i], &executie[i]);
    }

    double medii[3];
    medii[0] = (double)fcfs() / n;
    medii[1] = (double)sjf() / n;
    medii[2] = (double)round_robin() / n;
    const char *algoritmi[3] = { "FCFS", "SJF", "RR" };

    int cel_mai_bun = 0;
    for (int i = 0; i < 3; i++) {
        printf("%s: %.2f\n", algoritmi[i], medii[i]);
        if (medii[i] < medii[cel_mai_bun]) {
            cel_mai_bun = i;
        }
    }
    printf("Cel mai bun: %s\n", algoritmi[cel_mai_bun]);
    return 0;
}
```
