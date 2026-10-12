```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Allocate an array of n elements on the heap. sizeof(int) * n bytes.
    int *arr = malloc(n * sizeof(int));

    int sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum = sum + arr[i];
    }

    // Cast to double so we don't do integer division.
    double average = (double)sum / n;

    printf("%d\n", sum);
    printf("%.2f\n", average);

    // Free the memory allocated with malloc.
    free(arr);
    return 0;
}
```
