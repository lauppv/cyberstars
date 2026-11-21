```c
#include <stdio.h>
#include <string.h>

int cea_mai_lunga(int v[], int n) {
    int maxim = v[0];
    for (int i = 1; i < n; i++) {
        if (v[i] > maxim) {
            maxim = v[i];
        }
    }
    return maxim;
}

int main(void) {
    char nume[32];
    int n;
    int ore[50];
    int total = 0;
    scanf("%31s %d", nume, &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &ore[i]);
        total = total + ore[i];
    }

    printf("%s (%d litere)\n", nume, (int)strlen(nume));
    printf("Ture: %d\n", n);
    printf("Ore: %d\n", total);
    printf("Cea mai lunga tura: %d\n", cea_mai_lunga(ore, n));
    return 0;
}
```
