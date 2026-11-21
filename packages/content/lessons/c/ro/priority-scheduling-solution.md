```c
#include <stdio.h>

int main(void) {
    int n;
    char nume[20][8];
    int sosire[20], executie[20], prioritate[20], ramas[20], final[20];

    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d %d", nume[i], &sosire[i], &executie[i], &prioritate[i]);
        ramas[i] = executie[i];
    }

    int terminate = 0;
    int ultimul = -2;
    int inceput = 0;
    int t = 0;
    while (terminate < n) {
        int ales = -1;
        for (int i = 0; i < n; i++) {
            if (ramas[i] == 0 || sosire[i] > t) {
                continue;
            }
            if (ales == -1 || prioritate[i] < prioritate[ales] ||
                (prioritate[i] == prioritate[ales] && sosire[i] < sosire[ales])) {
                ales = i;
            }
        }

        if (ales != ultimul) {
            if (ultimul != -2) {
                printf("%d-%d %s\n", inceput, t, ultimul == -1 ? "idle" : nume[ultimul]);
            }
            ultimul = ales;
            inceput = t;
        }

        if (ales != -1) {
            ramas[ales]--;
            if (ramas[ales] == 0) {
                final[ales] = t + 1;
                terminate++;
            }
        }
        t++;
    }
    printf("%d-%d %s\n", inceput, t, nume[ultimul]);

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
