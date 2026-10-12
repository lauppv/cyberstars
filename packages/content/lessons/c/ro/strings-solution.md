```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char nume[64];
    fgets(nume, sizeof(nume), stdin);
    nume[strcspn(nume, "\n")] = '\0';

    printf("%s\n", nume);
    printf("%zu\n", strlen(nume));
    printf("%c\n", nume[0]);
    printf("%c\n", nume[strlen(nume) - 1]);
    return 0;
}
```
