```c
#include <stdio.h>

// We receive addresses, not values. We dereference with * to read/write
// the values stored at those addresses.
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x, y;
    scanf("%d", &x);
    scanf("%d", &y);

    // We pass the addresses of x and y so the function can modify the variables.
    swap(&x, &y);

    printf("%d %d\n", x, y);
    return 0;
}
```
