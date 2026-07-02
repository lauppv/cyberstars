```c
#include <stdio.h>

int sum_array(int *ptr, int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + *(ptr + i);
    }
    return total;
}

int main(void) {
    int n;
    scanf("%d", &n);

    int numbers[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &numbers[i]);
    }

    int result = sum_array(numbers, n);
    printf("%d\n", result);
    return 0;
}
```
