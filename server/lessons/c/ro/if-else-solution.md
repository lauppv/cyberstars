```c
#include <stdio.h>

int main(void) {
    int temperatura;
    scanf("%d", &temperatura);

    if (temperatura < 0) {
        printf("alerta frig\n");
    } else {
        printf("temperatura normala\n");
    }
    return 0;
}
```
