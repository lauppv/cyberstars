#include <stdio.h>
#include <string.h>

int main(void) {
    char name[64];
    scanf("%63s", name);
    printf("%s\n", name);
    printf("%zu\n", strlen(name));
    printf("%c\n", name[0]);
    printf("%c\n", name[strlen(name) - 1]);
    return 0;
}
