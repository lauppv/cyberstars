```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Alocam un tablou de n elemente in heap. sizeof(int) * n bytes.
    int *vector = malloc(n * sizeof(int));

    int suma = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &vector[i]);
        suma = suma + vector[i];
    }

    // Cast la double ca sa nu facem impartire intreaga.
    double medie = (double)suma / n;

    printf("%d\n", suma);
    printf("%.2f\n", medie);

    // Eliberam memoria alocata cu malloc.
    free(vector);
    return 0;
}
```
