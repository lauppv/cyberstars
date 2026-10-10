#include <stdio.h>
#include <string.h>

int main(void) {
    char name[64];
    if (fgets(name, 64, stdin) == NULL) return 0;
    size_t n = strlen(name);
    while (n > 0 && (name[n - 1] == '\n' || name[n - 1] == '\r')) name[--n] = '\0';

    puts(name);
    printf("%d\n", (int)strlen(name));
    putchar(name[0]);
    putchar('\n');
    putchar(name[n - 1]);
    putchar('\n');
    return 0;
}
