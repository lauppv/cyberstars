```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int *arr = malloc(n * sizeof(int));
    int sum = 0;

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }

    double average = (double)sum / n;

    printf("%d\n", sum);
    printf("%.2f\n", average);

    free(arr);
    return 0;
}
```
