```c
#include <stdio.h>

int main(void) {
    int n;
    char nume[20][8];
    int sosire[20], executie[20], asteptare[20], gata[20] = { 0 };

    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", nume[i], &sosire[i], &executie[i]);
    }

    int ceas = 0;
    int terminate = 0;
    while (terminate < n) {
        int ales = -1;
        for (int i = 0; i < n; i++) {
            if (gata[i] || sosire[i] > ceas) {
                continue;
            }
            if (ales == -1 || executie[i] < executie[ales] ||
                (executie[i] == executie[ales] && sosire[i] < sosire[ales])) {
                ales = i;
            }
        }

        if (ales == -1) {
            int urmator = -1;
            for (int i = 0; i < n; i++) {
                if (!gata[i] && (urmator == -1 || sosire[i] < sosire[urmator])) {
                    urmator = i;
                }
            }
            printf("%d-%d idle\n", ceas, sosire[urmator]);
            ceas = sosire[urmator];
            continue;
        }

        printf("%d-%d %s\n", ceas, ceas + executie[ales], nume[ales]);
        asteptare[ales] = ceas - sosire[ales];
        ceas = ceas + executie[ales];
        gata[ales] = 1;
        terminate++;
    }

    double total_asteptare = 0;
    double total_raspuns = 0;
    for (int i = 0; i < n; i++) {
        int raspuns = asteptare[i] + executie[i];
        printf("%s: asteptare %d, raspuns %d\n", nume[i], asteptare[i], raspuns);
        total_asteptare = total_asteptare + asteptare[i];
        total_raspuns = total_raspuns + raspuns;
    }
    printf("Asteptare medie: %.2f\n", total_asteptare / n);
    printf("Raspuns mediu: %.2f\n", total_raspuns / n);
    return 0;
}
```
