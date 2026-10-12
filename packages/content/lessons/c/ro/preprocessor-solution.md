```c
#include <stdio.h>

#define PI 3.14159
#define AREA_RECT(w, h) ((w) * (h))
#define AREA_CIRCLE(r) ((PI) * (r) * (r))
#define MAX_SIZE 100

int main(void) {
    printf("Sala: %d\n", AREA_RECT(5, 3));
    printf("Antena: %.2f\n", AREA_CIRCLE(4.0));
    printf("Limita: %d\n", MAX_SIZE);
    return 0;
}
```
