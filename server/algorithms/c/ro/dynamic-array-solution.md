```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int *vector = malloc(n * sizeof(int));
    int suma = 0;

    for (int i = 0; i < n; i++) {
        scanf("%d", &vector[i]);
        suma += vector[i];
    }

    double medie = (double)suma / n;

    printf("%d\n", suma);
    printf("%.2f\n", medie);

    free(vector);
    return 0;
}
```
