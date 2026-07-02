```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char primul[50];
    char al_doilea[50];
    scanf("%s %s", primul, al_doilea);

    printf("%lu\n", strlen(primul));

    char rezultat[50];
    strcpy(rezultat, primul);
    strcat(rezultat, al_doilea);
    printf("%s\n", rezultat);
    return 0;
}
```
