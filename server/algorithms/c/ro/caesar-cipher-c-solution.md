```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char text[201];
    int deplasare;

    if (fgets(text, sizeof(text), stdin) == NULL) {
        return 0;
    }
    text[strcspn(text, "\n")] = '\0';

    scanf("%d", &deplasare);

    for (int i = 0; text[i] != '\0'; i++) {
        char c = text[i];
        if (c >= 'A' && c <= 'Z') {
            c = 'A' + (c - 'A' + deplasare) % 26;
        } else if (c >= 'a' && c <= 'z') {
            c = 'a' + (c - 'a' + deplasare) % 26;
        }
        putchar(c);
    }
    putchar('\n');

    return 0;
}
```
