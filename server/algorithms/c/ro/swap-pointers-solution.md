```c
#include <stdio.h>

void interschimba(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x, y;
    scanf("%d %d", &x, &y);

    interschimba(&x, &y);

    printf("%d %d\n", x, y);
    return 0;
}
```
