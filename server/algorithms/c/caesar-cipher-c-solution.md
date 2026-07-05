```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char text[201];
    int shift;

    if (fgets(text, sizeof(text), stdin) == NULL) {
        return 0;
    }
    // fgets keeps '\n' at the end; replace it with the string terminator.
    text[strcspn(text, "\n")] = '\0';

    scanf("%d", &shift);

    // In ASCII, consecutive letters have consecutive codes. Subtracting 'A' (or 'a')
    // brings the letter into 0..25, we apply the shift with modulo 26 so we wrap
    // back to 'A'/'a' when we go past 'Z'/'z', then we add the base back.
    for (int i = 0; text[i] != '\0'; i++) {
        char c = text[i];
        if (c >= 'A' && c <= 'Z') {
            c = 'A' + (c - 'A' + shift) % 26;
        } else if (c >= 'a' && c <= 'z') {
            c = 'a' + (c - 'a' + shift) % 26;
        }
        printf("%c", c);
    }
    printf("\n");

    return 0;
}
```
