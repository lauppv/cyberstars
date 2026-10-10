#include <stdio.h>
#include <string.h>

int main(void) {
    char first[50], second[50], result[50];
    scanf("%s %s", first, second);
    strcpy(result, first);
    strcat(result, second);
    printf("%zu\n", strlen(second));
    printf("%s\n", result);
    return 0;
}
