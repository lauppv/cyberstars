```c
#include <stdio.h>

int n, q;
char nume[20][8];
int sosire[20], executie[20], ramas[20], final[20];
int adaugat[20];

int coada[2000];
int inceput = 0, sfarsit = 0;

void adauga_sositi(int ceas) {
    while (1) {
        int urmator = -1;
        for (int i = 0; i < n; i++) {
            if (!adaugat[i] && sosire[i] <= ceas &&
                (urmator == -1 || sosire[i] < sosire[urmator])) {
                urmator = i;
            }
        }
        if (urmator == -1) {
            return;
        }
        adaugat[urmator] = 1;
        coada[sfarsit] = urmator;
        sfarsit++;
    }
}

int main(void) {
    scanf("%d %d", &n, &q);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", nume[i], &sosire[i], &executie[i]);
        ramas[i] = executie[i];
    }

    int ceas = 0;
    int terminate = 0;
    adauga_sositi(ceas);
    while (terminate < n) {
        if (inceput == sfarsit) {
            int urmator = -1;
            for (int i = 0; i < n; i++) {
                if (!adaugat[i] && (urmator == -1 || sosire[i] < sosire[urmator])) {
                    urmator = i;
                }
            }
            printf("%d-%d idle\n", ceas, sosire[urmator]);
            ceas = sosire[urmator];
            adauga_sositi(ceas);
            continue;
        }

        int p = coada[inceput];
        inceput++;
        int felie = ramas[p] < q ? ramas[p] : q;
        printf("%d-%d %s\n", ceas, ceas + felie, nume[p]);
        ceas = ceas + felie;
        ramas[p] = ramas[p] - felie;

        adauga_sositi(ceas);
        if (ramas[p] > 0) {
            coada[sfarsit] = p;
            sfarsit++;
        } else {
            final[p] = ceas;
            terminate++;
        }
    }

    double total_asteptare = 0;
    double total_raspuns = 0;
    for (int i = 0; i < n; i++) {
        int raspuns = final[i] - sosire[i];
        int asteptare = raspuns - executie[i];
        printf("%s: asteptare %d, raspuns %d\n", nume[i], asteptare, raspuns);
        total_asteptare = total_asteptare + asteptare;
        total_raspuns = total_raspuns + raspuns;
    }
    printf("Asteptare medie: %.2f\n", total_asteptare / n);
    printf("Raspuns mediu: %.2f\n", total_raspuns / n);
    return 0;
}
```
