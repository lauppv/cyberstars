```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char text[201];
    int deplasare;

    if (fgets(text, sizeof(text), stdin) == NULL) {
        return 0;
    }
    // fgets pastreaza '\n' la final; il inlocuim cu terminator de string.
    text[strcspn(text, "\n")] = '\0';

    scanf("%d", &deplasare);

    // In ASCII, literele consecutive au coduri consecutive. Scazand 'A' (sau 'a')
    // aducem litera la 0..25, aplicam deplasarea cu modulo 26 ca sa ne intoarcem
    // la 'A'/'a' cand depasim 'Z'/'z', apoi adaugam baza inapoi.
    for (int i = 0; text[i] != '\0'; i++) {
        char c = text[i];
        if (c >= 'A' && c <= 'Z') {
            c = 'A' + (c - 'A' + deplasare) % 26;
        } else if (c >= 'a' && c <= 'z') {
            c = 'a' + (c - 'a' + deplasare) % 26;
        }
        printf("%c", c);
    }
    printf("\n");

    return 0;
}
```
