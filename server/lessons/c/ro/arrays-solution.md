```c
#include <stdio.h>

int main(void) {
    int consum[3];
    scanf("%d", &consum[0]);
    scanf("%d", &consum[1]);
    scanf("%d", &consum[2]);

    int n = sizeof(consum) / sizeof(consum[0]);

    printf("%d\n", n);
    printf("%d\n", consum[0]);
    printf("%d\n", consum[2]);
    return 0;
}
```
