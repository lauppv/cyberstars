```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int este_angajat, este_zi_lucratoare, este_oaspete, are_invitatie;
    scanf("%d %d %d %d", &este_angajat, &este_zi_lucratoare, &este_oaspete, &are_invitatie);

    if ((este_angajat && este_zi_lucratoare) || (este_oaspete && are_invitatie)) {
        printf("Acces permis\n");
    } else {
        printf("Acces refuzat\n");
    }

    return 0;
}
```
