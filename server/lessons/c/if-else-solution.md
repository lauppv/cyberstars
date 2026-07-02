```c
#include <stdio.h>

int main(void) {
    int temperature;
    scanf("%d", &temperature);

    if (temperature < 0) {
        printf("cold alert\n");
    } else {
        printf("temperature normal\n");
    }
    return 0;
}
```
