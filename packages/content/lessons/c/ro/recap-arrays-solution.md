```c
#include <stdio.h>

int numara_promovati(int note[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        if (note[i] < 50) {
            continue;
        }
        total = total + 1;
    }
    return total;
}

int gaseste_max(int note[], int n) {
    int max = note[0];
    for (int i = 1; i < n; i++) {
        if (note[i] > max) {
            max = note[i];
        }
    }
    return max;
}

int gaseste_prima_cadere(int note[], int n) {
    int prima = -1;
    for (int i = 0; i < n; i++) {
        if (note[i] < 50) {
            prima = note[i];
            break;
        }
    }
    return prima;
}

int main(void) {
    int n;
    scanf("%d", &n);

    int note[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &note[i]);
    }

    printf("Promovati: %d\n", numara_promovati(note, n));
    printf("Maxim: %d\n", gaseste_max(note, n));
    printf("Prima cadere: %d\n", gaseste_prima_cadere(note, n));

    return 0;
}
```
