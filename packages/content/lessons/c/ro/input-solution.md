```c
#include <stdio.h>

int main(void) {
    char nume[64];
    int varsta;

    scanf("%s", nume);
    scanf("%d", &varsta);

    printf("Salut %s, ai %d de ani. Anul viitor vei avea %d\n", nume, varsta, varsta + 1);
    return 0;
}
```
