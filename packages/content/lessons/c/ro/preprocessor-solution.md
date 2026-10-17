```c
#include <stdio.h>

#define PI 3.14159
#define ARIE_DREPTUNGHI(lung, lat) ((lung) * (lat))
#define ARIE_CERC(r) ((PI) * (r) * (r))
#define LIMITA_MAX 100

int main(void) {
    printf("Sala: %d\n", ARIE_DREPTUNGHI(5, 3));
    printf("Antena: %.2f\n", ARIE_CERC(4.0));
    printf("Limita: %d\n", LIMITA_MAX);
    return 0;
}
```
