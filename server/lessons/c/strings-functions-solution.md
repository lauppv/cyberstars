```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char first[50];
    char second[50];
    scanf("%s %s", first, second);

    printf("%lu\n", strlen(first));

    char result[50];
    strcpy(result, first);
    strcat(result, second);
    printf("%s\n", result);
    return 0;
}
```
